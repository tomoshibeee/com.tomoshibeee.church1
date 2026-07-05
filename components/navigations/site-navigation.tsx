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

    alert("ブロックが更新されました。");
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
