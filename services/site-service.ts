import { supabase } from "@/lib/supabase";

import { SiteData } from "@/types/site";
import { SectionData } from "@/features/section/types"
import { MenuItem } from "@/types/site-menu";
import { SiteMeta } from "@/models/site-meta";

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

    // C. layout.sections と blocks の保存
    (async () => {
      if (!layout?.sections) return;

      for (const section of layout.sections) {
        const isNewsSection = section.type === "site_news" || section.type === "global_news";

        if (!isNewsSection && section.blocks) {
          for (const block of section.blocks) {
            const b = block as { id?: string; type: string; variant?: string; data: any };

            const { error } = await supabase
              .from("t_site_blocks")
              .upsert({
                id: b.id,
                section_id: section.id,
                type: b.type,
                variant: b.variant ?? "",
                data: b.data,
                updated_at: new Date().toISOString(),
              });

            if (error) {
              console.error("❌ t_site_blocks upsert error:", error);
              throw error;
            }
          }
        }
      }
    })(),
  ]);

  console.log(`[success] Site data for "${siteId}" has been successfully updated.`);
}