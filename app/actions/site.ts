"use server";

import { createSiteData, updateSiteData } from "@/services/site-service";
import { SiteData } from "@/types/site";
import { redirect } from "next/navigation";

export async function createSiteAction(siteData: SiteData) {
  console.log("=== Server Action 開始 (新規作成 RPC) ===");

  let newSiteId: string;

  try {
    newSiteId = await createSiteData(siteData);
    console.log("サイト作成成功 siteId:", newSiteId);
  } catch (error) {
    console.error("createSiteAction エラー:", error);
    return { success: false, error: String(error) };
  }

  // 作成完了後、該当サイトのダッシュボード/編集画面へリダイレクト
  redirect(`/dashboard/${newSiteId}`);
}

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