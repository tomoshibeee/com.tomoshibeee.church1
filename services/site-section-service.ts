import { supabase } from "@/lib/supabase";

import { SiteSection } from "@/models/site-section";

export async function getSiteSections(siteId: string): Promise<SiteSection[]> {
  const { data, error } = await supabase
    .from("t_sections")
    .select("*")
    .eq("site_id", siteId);

  if (error) {
    console.error(`Error fetching sections for site ID "${siteId}":`, error);
    throw error;
  }

  return data;
}