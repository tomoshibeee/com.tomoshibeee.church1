import { supabase } from "@/lib/supabase";

import { Site } from "@/models/site";
import { SiteMeta } from "@/models/site-meta";
import { MetaData } from "@/types/site-meta";

export async function getSiteMetas() {
  const { data, error } = await supabase.from("t_site_metas").select("*");
  if (error) {
    console.error("Error fetching site metas:", error);
    throw error;
  }
  return data;
}

export async function getSiteMeta(siteId: string): Promise<SiteMeta> {
  const { data, error } = await supabase
    .from("t_site_metas")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching site meta for site ID "${siteId}":`, error);
    throw error;
  }

  return data;
}

export function toMetaData(site: Site, meta: SiteMeta): MetaData {
  return {
    site_id: site.id,
    site_no: site.site_no,
    slug: meta.slug,
    name: meta.name,
    tel: meta.tel,
    email: meta.email,
    postalCode: meta.postal_code,
    address: meta.address,
    bldg: meta.building,
    access: meta.access,
    description: meta.description ?? "",
    background_image: meta.background_image ?? "",
    avatar: meta.avatar ?? "",
  }
}