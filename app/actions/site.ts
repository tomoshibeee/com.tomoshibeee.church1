"use server";

import { updateSiteData } from "@/services/site-service";
import { SiteData } from "@/types/site";

export async function saveSiteAction(siteId: string, data: SiteData) {
  try {
    await updateSiteData(siteId, data);
    return { success: true };
  } catch (error) {
    console.error("Failed to update site:", error);
    return { success: false, error: "保存に失敗しました" };
  }
}