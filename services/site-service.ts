import { supabase } from "@/lib/supabase";

import { SiteData } from "@/types/site";
import { SectionData } from "@/features/section/types"
import { MenuItem } from "@/types/site-menu";

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

  // 1️⃣ まとめて並列処理（Promise.all）で効率よく各テーブルを逆変換・保存
  await Promise.all([
    // A. t_sites テーブル（navigation.menu の保存）
    // DB側（t_sites.navigation）にメニューの配列をそのままJSONとして保存します
    supabase
      .from("t_sites")
      .update({
        navigation: navigation?.menu ?? [], // ⭕️ ここが getSiteData の逆！
        updated_at: new Date().toISOString(),
      })
      .eq("id", siteId),

    // B. t_site_metas テーブルの更新
    // meta（SiteData.meta）の中に含まれる、タイトルや説明文、slug などをバラして保存
    supabase
      .from("t_site_metas")
      .upsert({
        site_id: siteId,
        title: meta.name,
        description: meta.description,
        slug: meta.slug,
        // その他 meta に含まれるカラムがあればここにマッピング
        updated_at: new Date().toISOString(),
      }),

    // C. layout.sections と blocks の保存
    // 階層構造になっている layout を分解して、各セクション・ブロックをループ処理
    (async () => {
      if (!layout?.sections) return;

      for (const section of layout.sections) {
        // ※ お知らせ（site_news, global_news）は、blocksテーブルではなく
        // 専用テーブルで管理されているため、通常のブロックのみをフィルタリングして保存します
        const isNewsSection = section.type === "site_news" || section.type === "global_news";

        if (!isNewsSection && section.blocks) {
          // 各ブロックのデータを更新
          for (const block of section.blocks) {
            const b = block as { id?: string; type: string; variant?: string; data: any };

            await supabase
              .from("t_site_blocks")
              .upsert({
                id: b.id,
                section_id: section.id,
                type: b.type,
                // 💡 variant が存在すればその値（"single"など）を、なければ空文字 "" または null を入れる
                variant: b.variant ?? "",
                data: b.data,
                updated_at: new Date().toISOString(),
              });
          }
        }
      }
    })(),
  ]);

  console.log(`[success] Site data for "${siteId}" has been successfully updated.`);
}
