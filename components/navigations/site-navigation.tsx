"use client";

import { useState } from "react";
import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { ImagePickerProvider } from "@/components/image-picker";
import { MetaModal } from "@/features/meta/components/meta-modal";
import { MenuModal } from "@/features/menu/components/menu-modal";
import { MetaData } from "@/types/site-meta";
import { MenuItem } from "@/types/site-menu";
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

  // ⭕️ 各モーダルの開閉状態を個別に管理
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ⭕️ 基本情報の保存（ネストのバグを修正）
  const handleSaveMeta = async (updatedMeta: MetaData) => {
    setSite((prevSite) => ({
      ...prevSite,
      meta: {
        ...prevSite.meta,
        ...updatedMeta,
      },
    }));
  };

  // ⭕️ メニューの保存（関数としてきれいに分離）
  const handleSaveMenu = async (updatedMenu: MenuItem[]) => {
    setSite((prevSite) => ({
      ...prevSite,
      navigation: {
        ...prevSite.navigation, // navigationオブジェクトの他の設定（あれば）を維持
        menu: updatedMenu, // 👈 ここで最新のメニュー配列に丸ごと差し替える！
      },
    }));

    // ※ 将来的にDBへ保存するAPIを叩く場合はここに追記します
  };

  // 💡 ブロックのデータ更新処理
  const handleUpdateBlock = (
    blockId: string,
    updatedData: Record<string, any>,
  ) => {
    setSite((prevSite) => {
      const nextSections = prevSite.layout.sections.map((section) => {
        const nextBlocks = section.blocks.map((block) => {
          if (block.id === blockId) {
            return {
              ...block,
              data: {
                ...block.data,
                ...updatedData,
              },
            } as typeof block;
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
  };

  return (
    <>
      <ImagePickerProvider>
        <Template
          site={site}
          edit
          newsItems={newsItems}
          onUpdateBlock={handleUpdateBlock}
          onOpenMetaEditor={() => setIsMetaOpen(true)}
          onOpenMenuEditor={() => setIsMenuOpen(true)}
        />
      </ImagePickerProvider>

      {/* 基本情報編集モーダル */}
      <MetaModal
        isOpen={isMetaOpen}
        onClose={() => setIsMetaOpen(false)}
        initialData={site.meta}
        onSave={handleSaveMeta}
      />

      {/* ⭕️ ナビゲーションメニュー編集モーダル */}
      <MenuModal
        isOpen={isMenuOpen} // 👈 専用のステートに変更
        onClose={() => setIsMenuOpen(false)}
        initialData={site.navigation?.menu ?? []}
        onSave={handleSaveMenu} // 👈 上で定義した関数をスッキリ指定
      />
    </>
  );
}
