"use server";

import { updateSiteData } from "@/services/site-service";
import { SiteData } from "@/types/site";

export async function saveSiteAction(siteId: string, data: SiteData) {
  console.log("=== Server Action 開始 ===");
  console.log("target siteId:", siteId);
  console.log("payload data:", JSON.stringify(data, null, 2));

  try {
    const result = await updateSiteData(siteId, data);
    console.log("updateSiteData 実行結果:", result);
    return { success: true };
  } catch (error) {
    // Supabaseのエラーメッセージを詳細に出力
    console.error("Supabase Save Error:", error);
    return { success: false, error: String(error) };
  }
}