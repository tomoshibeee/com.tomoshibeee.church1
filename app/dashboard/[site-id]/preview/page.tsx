"use client";

import { useEffect, useState, use } from "react";
import Template from "@/components/templates/template";

export default function PreviewPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  // 1. params をアンラップ（use を使って確実に同期的に扱える状態にする）
  const { siteId } = use(params);
  
  // メモリ上のサイトデータを管理するState（初期値は null）
  const [siteData, setSiteData] = useState<any>(null);
  // 読み込み中かどうかを管理するフラグ
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!siteId) return;

    // 2. localStorage からデータを復元
    const savedData = localStorage.getItem(`preview-${siteId}`);
    if (savedData) {
      setSiteData(JSON.parse(savedData));
    }
    setIsLoading(false); // 読み込み完了

    // 3. 編集画面側からのリアルタイム更新を検知するリスナー
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `preview-${siteId}` && e.newValue) {
        setSiteData(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [siteId]);

  // ⚠️ 重要：データが準備できるまでは、絶対に後ろのコンポーネント（Templateなど）を動かさない！
  if (isLoading || !siteData) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        編集データを読み込み中...
      </div>
    );
  }

  // ここに到達した時点では、絶対に siteData（の中にsiteIdなどが入っている）が存在する
  return <Template site={siteData} edit={false} newsItems={[]} />;
}