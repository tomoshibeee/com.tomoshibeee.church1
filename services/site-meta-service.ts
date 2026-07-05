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

// ⭕️ 1. 画面用の MetaData から DB用の SiteMeta（の型、または挿入用オブジェクト）へ逆変換する関数
export function toSiteMetaModel(meta: MetaData): Partial<SiteMeta> {
  return {
    slug: meta.slug,
    name: meta.name,
    tel: meta.tel,
    email: meta.email,
    postal_code: meta.postalCode, // 逆マッピング
    address: meta.address,
    building: meta.bldg,          // 逆マッピング
    access: meta.access,
    description: meta.description || null, // 空文字ならDBにはnull（またはそのまま）
    background_image: meta.background_image || null,
    avatar: meta.avatar || null,
    // updated_at などの共通カラムがあればここで入れてもOKです
  };
}

// ⭕️ 2. 実際に Supabase の t_site_metas テーブルを更新（upsert）する関数
export async function updateSiteMeta(siteId: string, metaData: MetaData): Promise<void> {
  // 画面用のデータをDB用のモデルに逆変換
  const dbMeta = toSiteMetaModel(metaData);

  const { error } = await supabase
    .from("t_site_metas")
    .upsert({
      site_id: siteId, // 主キー（またはユニークキー）を指定して上書き
      ...dbMeta,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "site_id" // site_id が衝突したらアップデートする設定
    });

  if (error) {
    console.error(`Error updating site meta for site ID "${siteId}":`, error);
    throw error;
  }
}