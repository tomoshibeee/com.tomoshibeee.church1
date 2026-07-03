import { supabase } from "@/lib/supabase";

import { SiteBlock } from "@/models/site-block";

export async function getSiteBlocks(sectionId: string): Promise<SiteBlock[]> {
    const { data, error } = await supabase
        .from("t_blocks")
        .select("*")
        .eq("section_id", sectionId);

    if (error) {
        console.error(`Error fetching blocks for section ID "${sectionId}":`, error);
        throw error;
    }

    return data;

}