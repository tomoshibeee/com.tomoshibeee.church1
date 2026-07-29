import { supabase } from "@/lib/supabase";

import { SiteData } from "@/types/site";
import { SectionData } from "@/features/section/types"
import { MenuItem } from "@/types/site-menu";
import { SiteMeta } from "@/models/site-meta";
import { SiteSection, SectionType } from "@/models/site-section";
import { SiteBlock, BlockType } from "@/models/site-block";

import { Site } from "@/models/site";

import { getSiteMeta, toMetaData } from "@/services/site-meta-service";
import { getSiteSections } from "@/services/site-section-service";
import { getSiteBlocks } from "@/services/site-block-service";
import { getSiteNews, toSiteNewsItems } from "@/services/site-news-service";
import { getGlobalNews, toGlobalNewsItems } from "@/services/global-news-service";
import { getSiteSocialLinks } from "@/services/site-social-link-service";

import { updateSiteMeta } from "@/services/site-meta-service";

export async function getSites() {
  const { data, error } = await supabase.from("t_sites").select("*");
  if (error) {
    console.error("Error fetching sites:", error);
    throw error;
  }

  return data;
}


export async function getSiteIdBySlug(slug: string) {
  const { data, error } = await supabase
    .from("t_site_metas")
    .select("site_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching site ID for slug "${slug}":`, error);
    throw error;
  }

  return data?.site_id || "";
}

export async function getSiteId(no: number) {
  const { data, error } = await supabase
    .from("t_site_metas")
    .select("site_id")
    .eq("site_no", no)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching site for no "${no}":`, error);
    throw error;
  }

  return data?.site_id || "";
}


async function getSite(siteId: string): Promise<Site> {
  const { data, error } = await supabase
    .from("t_sites")
    .select("*")
    .eq("id", siteId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching site for site ID "${siteId}":`, error);
    throw error;
  }

  return data;
}

export async function getSiteData(siteId: string): Promise<SiteData> {
  const [site, meta, globalNews, siteNews, socialLinks, sections] = await Promise.all([
    getSite(siteId),
    getSiteMeta(siteId),
    getGlobalNews(),
    getSiteNews(siteId),
    getSiteSocialLinks(siteId),
    getSiteSections(siteId)
  ]);
  const siteNewsItems = toSiteNewsItems(siteNews);
  const globalNewsItems = toGlobalNewsItems(globalNews);

  const sectionData = await Promise.all(
    sections.map(async (s) => {
      const blocks = await getSiteBlocks(s.id);
      let blocksWithNews;

      switch (s.type) {
        case "site_news":
          blocksWithNews = [
            {
              id: s.id,
              type: "news",
              variant: "",
              data: {
                items: siteNewsItems,
              },
            },
          ];
          break;

        case "global_news":
          blocksWithNews = [
            {
              id: s.id,
              type: "news",
              variant: "",
              data: {
                items: globalNewsItems,
              },
            },
          ];
          break;

        default:
          blocksWithNews = blocks;
      }
      return {
        id: s.id,
        type: s.type,
        blocks: blocksWithNews
      };
    })
  );
  const ret = {
    meta: toMetaData(site, meta),
    navigation: {
      menu: site?.navigation ?? []
    } as { menu?: MenuItem[] },
    layout: {
      sections: sectionData as SectionData[],
    },
    socialLinks: socialLinks,
  };

  return ret as SiteData;
}

export async function createSiteData(siteData: SiteData): Promise<string> {
  const { data, error } = await supabase.rpc("create_site_all", {
    payload: siteData,
  });

  if (error) {
    console.error("❌ create_site_all RPC Error:", error);
    throw new Error(error.message);
  }

  return data as string; // 作成された site_id (UUID) が返ってきます
}

export async function updateSiteData(siteId: string, siteData: SiteData): Promise<void> {
  const { meta, navigation, layout } = siteData;

  // 1️⃣ 並列処理で各テーブルを保存
  await Promise.all([
    // A. t_sites テーブル（navigation.menu の保存）
    (async () => {
      const { error, count } = await supabase
        .from("t_sites")
        .update({
          navigation: navigation?.menu ?? [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", siteId); // ⚠️ DB側のキー名が 'id' か 'site_id' か確認してください

      if (error) {
        console.error("❌ t_sites update error:", error);
        throw error;
      }
    })(),

    // B. t_site_metas テーブルの更新
    (async () => {
      // DBの型（SiteMeta）に合わせてオブジェクトを作成
      // Omit で自動生成される id / created_at を除外しておくと型チェックが効きます
      const metaPayload: Omit<SiteMeta, "id" | "created_at"> = {
        site_id: siteId,
        name: meta.name,
        slug: meta.slug,
        description: meta.description ?? null,
        tel: meta.tel,
        email: meta.email,
        postal_code: meta.postalCode ?? "", // TODO : キャメルケース -> スネークケース
        address: meta.address,
        building: meta.bldg ?? "",         // TODO : bldg -> building
        access: meta.access,
        background_image: meta.background_image ?? null,
        avatar: meta.avatar ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("t_site_metas")
        .upsert(metaPayload, { onConflict: "site_id" }); // site_id をキーにして更新

      if (error) {
        console.error("❌ t_site_metas upsert error:", error);
        throw error;
      }
    })(),

    // C. layout.sections と t_blocks の保存（追加・更新・差分削除）
    (async () => {
      if (!layout?.sections) return;

      const currentSections = layout.sections;

      // --------------------------------------------------
      // 1. 画面上に存在する ID のリストを抽出
      // --------------------------------------------------
      const activeSectionIds = currentSections.map((s) => s.id);
      const activeBlockIds = currentSections.flatMap(
        (s) => s.blocks?.map((b) => b.id) ?? []
      );

      // --------------------------------------------------
      // 2. 画面から消えた（DBに残っている）データの削除
      // --------------------------------------------------
      // UIに存在しない Section をDBから削除
      if (activeSectionIds.length > 0) {
        const { error: delSecError } = await supabase
          .from("t_sections")
          .delete()
          .eq("site_id", siteId)
          .not("id", "in", `(${activeSectionIds.join(",")})`);

        if (delSecError) console.error("❌ t_site_sections delete error:", delSecError);
      }

      // UIに存在しない Block をDBから削除
      // （該当サイトのセクションに紐づくブロックのうち、画面にないものを削除）
      if (activeBlockIds.length > 0) {
        const { error: delBlockError } = await supabase
          .from("t_blocks")
          .delete()
          .in("section_id", activeSectionIds)
          .not("id", "in", `(${activeBlockIds.join(",")})`);

        if (delBlockError) console.error("❌ t_blocks delete error:", delBlockError);
      }

      // --------------------------------------------------
      // 3. 追加・更新（upsert）の実行
      // --------------------------------------------------
      for (let sIdx = 0; sIdx < currentSections.length; sIdx++) {
        const section = currentSections[sIdx];

        // 親（Section）の upsert
        const sectionPayload: Omit<SiteSection, "created_at"> = {
          id: section.id, // 新規追加の場合もフロントで生成したUUIDが入る
          site_id: siteId,
          type: section.type as SectionType,
          display_order: sIdx + 1,
          updated_at: new Date().toISOString(),
        };

        const { error: sectionError } = await supabase
          .from("t_sections")
          .upsert(sectionPayload);

        if (sectionError) throw sectionError;

        // 子（Block）の upsert
        const isNewsSection = section.type === "site_news" || section.type === "global_news";

        if (!isNewsSection && section.blocks) {
          for (let bIdx = 0; bIdx < section.blocks.length; bIdx++) {
            const block = section.blocks[bIdx];

            const blockPayload: Omit<SiteBlock, "created_at"> = {
              id: block.id ?? crypto.randomUUID(),
              section_id: section.id,
              type: block.type as BlockType,
              variant: block.variant ?? "",
              data: block.data ?? {},
              display_order: bIdx + 1,
              updated_at: new Date().toISOString(),
            };

            const { error: blockError } = await supabase
              .from("t_blocks")
              .upsert(blockPayload);

            if (blockError) throw blockError;
          }
        }
      }
    })(),]);

  console.log(`[success] Site data for "${siteId}" has been successfully updated.`);
}