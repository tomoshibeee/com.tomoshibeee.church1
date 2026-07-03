import { supabase } from "@/lib/supabase";

import { SiteSocialLink } from "@/models/site-social-link";
export async function getSiteSocialLinks(siteId: string): Promise<SiteSocialLink[]> {
  const { data, error } = await supabase
    .from("t_site_social_links")
    .select("*")
    .eq("site_id", siteId);

  if (error) {
    console.error(`Error fetching social links for site ID "${siteId}":`, error);
    throw error;
  }

  return data;
}
