"use client";

import { use, useSyncExternalStore } from "react";
import Template from "@/components/templates/template";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("local-storage-update", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("local-storage-update", callback);
  };
}

export default function PreviewPage({
  params,
}: {
  params: Promise<{ "site-id": string }>;
}) {
  const resolvedParams = use(params);
  const siteId = resolvedParams["site-id"];

  // 1. useSyncExternalStore で初期値と更新イベントを監視
  const siteDataRaw = useSyncExternalStore(
    subscribe,
    // クライアント側（ブラウザ）で常に最新の localStorage 値を取得
    () => {
      if (typeof window === "undefined" || !siteId) return null;
      return localStorage.getItem(`preview-${siteId}`);
    },
    // サーバーサイド（SSR）初期値
    () => null
  );

  // 2. パース処理
  const siteData = siteDataRaw ? JSON.parse(siteDataRaw) : null;

  // 3. ローディング表示
  if (!siteData) {
    return (
      <div className="p-8 font-sans text-slate-700">
        <p className="font-bold">編集データを読み込み中...</p>
      </div>
    );
  }

  // 4. テンプレート描画
  return <Template site={siteData} edit={false} newsItems={[]} />;
}