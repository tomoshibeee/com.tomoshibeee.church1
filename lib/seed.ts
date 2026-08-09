import "dotenv/config";

import { createClient } from "@supabase/supabase-js";

import { dummyNewsModelData } from "../data/seed-data-news";
import { dummySiteModelData } from "../data/seed-data-sites";
import { dummySiteMetaModelData } from "../data/seed-data-site-metas";
import { dummySiteNewsModelData } from "../data/seed-data-site-news";
import { dummySiteSocialLinkModelData } from "../data/seed-data-site-social-links";
import { dummySiteSectionModelData } from "../data/seed-data-site-sections";
import { dummySiteBlockModelData } from "../data/seed-data-site-blocks";
import { dummyMasterBlockData } from "../data/seed-data-master-blocks";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function runSeed() {
  const env = process.env.NODE_ENV || "dev";

  console.log("🚦URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("🚦ENV:", env);

  if (env === "production") {
    throw new Error("❌ Do NOT run seed in production");
  }

  console.log("🌱 Seeding started...");

  // =========================
  // 0. Master Blocks の同期（削除せず upsert）
  // =========================
  const { data: masterBlocks, error: masterBlocksError } = await supabase
    .from("m_blocks") // テーブル名を複数形に修正
    .upsert(dummyMasterBlockData(), { onConflict: "type" })
    .select();

  if (masterBlocksError || !masterBlocks) {
    console.error("❌ masterBlocks insert error:", masterBlocksError);
    return;
  }
  console.log("✅ m_blocks synced:", masterBlocks.map((b) => b.type));

  // =========================
  // 1. 既存トランザクションデータのクリア
  // =========================
  // ※ m_blocks は削除対象から除外しています
  const tables = [
    "t_site_news",
    "t_blocks",
    "t_sections",
    "t_site_social_links",
    "t_site_metas",
    "t_sites",
    "t_global_news",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().not("id", "is", null);
    if (error) {
      console.error(`❌ Error clearing table ${table}:`, error);
      return;
    }
    console.log(`✅ Cleared table ${table}`);
  }

  // =========================
  // 2. News作成
  // =========================
  const { data: news, error: newsError } = await supabase
    .from("t_global_news")
    .insert(dummyNewsModelData())
    .select();

  if (newsError || !news) {
    console.error("❌ news insert error:", newsError);
    return;
  }
  console.log("✅ news created:", news.map((n) => n.id));

  // =========================
  // 3. Sites
  // =========================
  const { data: sites, error: sitesError } = await supabase
    .from("t_sites")
    .insert(dummySiteModelData())
    .select();

  if (sitesError || !sites) {
    console.error("❌ sites insert error:", sitesError);
    return;
  }
  const siteIds = sites.map((n) => n.id);
  console.log("✅ sites created:", siteIds);

  // =========================
  // 4. Site Metas
  // =========================
  const dummySiteMetasModelData = dummySiteMetaModelData(siteIds);
  const { data: siteMetas, error: siteMetasError } = await supabase
    .from("t_site_metas")
    .insert(dummySiteMetasModelData)
    .select();

  if (siteMetasError || !siteMetas) {
    console.error("❌ siteMetas insert error:", siteMetasError);
    return;
  }
  console.log("✅ site metas created");

  // =========================
  // 5. Site News
  // =========================
  const siteNewsRows = dummySiteNewsModelData(siteIds);
  const { data: siteNews, error: siteNewsError } = await supabase
    .from("t_site_news")
    .insert(siteNewsRows)
    .select();

  if (siteNewsError || !siteNews) {
    console.error("❌ siteNews insert error:", siteNewsError);
    return;
  }
  console.log("✅ site news created");

  // =========================
  // 6. Site Social Links
  // =========================
  const { data: siteSocialLinks, error: siteSocialLinksError } = await supabase
    .from("t_site_social_links")
    .insert(dummySiteSocialLinkModelData(siteIds))
    .select();

  if (siteSocialLinksError || !siteSocialLinks) {
    console.error("❌ siteSocialLinks insert error:", siteSocialLinksError);
    return;
  }
  console.log("✅ site social links created");

  // =========================
  // 7. Site Sections
  // =========================
  const siteSectionModelData = dummySiteSectionModelData(siteIds);
  const { data: siteSections, error: siteSectionsError } = await supabase
    .from("t_sections")
    .insert(siteSectionModelData)
    .select();

  if (siteSectionsError || !siteSections) {
    console.error("❌ siteSections insert error:", siteSectionsError);
    return;
  }
  console.log("✅ site sections created");

  // =========================
  // 8. Site Blocks
  // =========================
  const siteBlockModelData = dummySiteBlockModelData(
    siteIds,
    siteSectionModelData
  );
  const { data: siteBlocks, error: siteBlocksError } = await supabase
    .from("t_blocks")
    .insert(siteBlockModelData)
    .select();

  if (siteBlocksError || !siteBlocks) {
    console.error("❌ siteBlocks insert error:", siteBlocksError);
    return;
  }
  console.log("✅ site blocks created");

  console.log("🚀 Seed completed!");
}

runSeed();