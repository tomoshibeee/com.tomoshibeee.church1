import { supabase } from "@/lib/supabase";

import { SiteData } from "@/types/site";
import { SectionData } from "@/features/section/types"
import { MenuItem } from "@/types/site-menu";

import { Site } from "@/models/site";
import { SectionType } from "@/models/site-section";

import { getSiteMeta, toMetaData } from "@/services/site-meta-service";
import { getSiteSections } from "@/services/site-section-service";
import { getSiteBlocks } from "@/services/site-block-service";
import { getSiteNews, toSiteNewsItems } from "@/services/site-news-service";
import { getGlobalNews, toGlobalNewsItems } from "@/services/global-news-service";
import { getSiteSocialLinks } from "@/services/site-social-link-service";

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


