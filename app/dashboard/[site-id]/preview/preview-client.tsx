"use client";

import { useSyncExternalStore } from "react";
import Template from "@/components/templates/template";
import { UserData } from "@/types/user";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("local-storage-update", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("local-storage-update", callback);
  };
}

type Props = {
  siteId: string;
  user: UserData;
};

export default function PreviewClient(props: Props) {
  const { siteId, user } = props;
  // localStorage の最新値を監視して取得
  const siteDataRaw = useSyncExternalStore(
    subscribe,
    () => {
      if (typeof window === "undefined" || !siteId) return null;
      return localStorage.getItem(`preview-${siteId}`);
    },
    () => null,
  );

  const siteData = siteDataRaw ? JSON.parse(siteDataRaw) : null;

  if (!siteData) {
    return (
      <div className="p-8 font-sans text-slate-700">
        <p className="font-bold">編集データを読み込み中...</p>
      </div>
    );
  }

  return <Template site={siteData} mode="preview" newsItems={[]} user={user} />;
}
