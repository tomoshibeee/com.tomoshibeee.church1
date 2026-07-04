"use client";

import { useState } from "react";
import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { ImagePickerProvider } from "@/components/image-picker";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site: SiteData;
  newsItems: NewsItem[];
};

export default function SiteNavigation({
  site: initialSite,
  newsItems,
}: Props) {
  const [site, setSite] = useState<SiteData>(initialSite);
  const handleUpdateBlock = () => {
    // ここでサイトデータを更新する処理を実装する
    // 例えば、APIを呼び出してデータを保存し、最新のサイトデータを取得するなど
    // ここでは仮にsetSiteで更新する例を示す
    setSite((prevSite) => ({
      ...prevSite,
      // 必要に応じて更新内容を反映させる
    }));
    alert("ブロックが更新されました。"); // 確認用のアラート
  };
  return (
    <ImagePickerProvider>
      {/* 💡 site をそのまま流し込むだけでOK。Templateの中で展開する必要もなくなります */}
      <Template
        site={site}
        edit
        newsItems={newsItems}
        onUpdateBlock={handleUpdateBlock}
      />
    </ImagePickerProvider>
  );
}
