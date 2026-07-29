"use server";

import { createSiteData, updateSiteData } from "@/services/site-service";
import { generateInitialSiteData } from "@/utils/generateInitialSiteData";
import { SiteData } from "@/types/site";
import { redirect } from "next/navigation";

export async function createSiteAction(name: string, slug: string) {
  let newSiteId: string;

  try {
    // 1. 静的関数から初期データオブジェクトを作成
    const initialData = generateInitialSiteData(name, slug);

    // 2. DB (RPC等) に登録
    newSiteId = await createSiteData(initialData);
  } catch (error) {
    console.error("createSiteAction エラー:", error);
    return { success: false, error: String(error) };
  }

  // 3. 作成されたサイトのダッシュボード等へリダイレクト
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