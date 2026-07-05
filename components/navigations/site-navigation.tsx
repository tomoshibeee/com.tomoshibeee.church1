"use client";

import { useState } from "react";
import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { ImagePickerProvider } from "@/components/image-picker";
import { MetaModal } from "@/features/meta/components/meta-modal";
import { MetaData } from "@/types/site-meta";
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
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const handleSaveMeta = async (updatedMeta: MetaData) => {
    // ここでローカルのステートを更新（これでAccessやContactの表示がリアルタイムに変わる）
    setSite({ ...site, ...updatedMeta });

    // ※実際のDBへの保存は、右上の「サイト公開・保存」ボタンで一括で行うか、
    // あるいはここで個別に API (axios/fetch) を叩いてもOKです。
  };
  // 💡 引数を (blockId, updatedData) を受け取れるように修正
  const handleUpdateBlock = (
    blockId: string,
    updatedData: Record<string, any>,
  ) => {
    setSite((prevSite) => {
      const nextSections = prevSite.layout.sections.map((section) => {
        const nextBlocks = section.blocks.map((block) => {
          if (block.id === blockId) {
            // 💡 解決策: 元の block 自体の型と構造を維持したまま、
            // data の中身だけを安全に上書きします
            return {
              ...block,
              data: {
                ...block.data,
                ...updatedData,
              },
            } as typeof block; // 💡 「型は元のままだよ」とキャスト（明示）する
          }
          return block;
        });

        return {
          ...section,
          blocks: nextBlocks,
        };
      });

      return {
        ...prevSite,
        layout: {
          ...prevSite.layout,
          sections: nextSections,
        },
      };
    });

    // alert("ブロックが更新されました。");
  };
  return (
    <>
      <ImagePickerProvider>
        {/* 💡 site をそのまま流し込むだけでOK。Templateの中で展開する必要もなくなります */}
        <Template
          site={site}
          edit
          newsItems={newsItems}
          onUpdateBlock={handleUpdateBlock}
          onOpenMetaEditor={() => setIsMetaOpen(true)}
        />
      </ImagePickerProvider>
      {/* モーダル本体 */}
      <MetaModal
        isOpen={isMetaOpen}
        onClose={() => setIsMetaOpen(false)}
        initialData={site.meta}
        onSave={handleSaveMeta}
      />
    </>
  );
}
