"use client";

import { useState, useEffect } from "react";
import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { ImagePickerProvider } from "@/components/image-picker";
import { MetaModal } from "@/features/meta/components/meta-modal";
import { MenuModal } from "@/features/menu/components/menu-modal";
import { BlockModal } from "@/features/block/components/block-modal"; // 👈 ブロック追加モーダル
import { MetaData } from "@/types/site-meta";
import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types";
import { UserData } from "@/types/user";
import { Section } from "@/features/section/types";
import { MasterBlock } from "@/models/master-block"; // 👈 追加
import { getMasterBlocks } from "@/services/master-block-service";

type Props = {
  site: SiteData;
  newsItems: NewsItem[];
  user?: UserData; // 編集画面で必要
};

export default function SiteNavigation(props: Props) {
  const { site: initialSite, newsItems, user } = props;
  const [site, setSite] = useState<SiteData>(initialSite);

  // 各モーダルの開閉状態を個別に管理
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false); // 👈 ブロック追加モーダル用

  // 編集中のサイトデータを localStorage に同期
  useEffect(() => {
    if (site?.meta?.site_id) {
      localStorage.setItem(
        `preview-${site.meta.site_id}`,
        JSON.stringify(site),
      );
    }
  }, [site]);

  // 基本情報の保存
  const handleSaveMeta = async (updatedMeta: MetaData) => {
    setSite((prevSite) => ({
      ...prevSite,
      meta: {
        ...prevSite.meta,
        ...updatedMeta,
      },
    }));
  };

  // メニューの保存
  const handleSaveMenu = async (updatedMenu: MenuItem[]) => {
    setSite((prevSite) => ({
      ...prevSite,
      navigation: {
        ...prevSite.navigation,
        menu: updatedMenu,
      },
    }));
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

  // ➕ マスターから最新データを取得して SiteBlock を生成・追加する処理
  const handleAddBlockFromMaster = async (masterBlock: MasterBlock) => {
    // try {
    //   // 1. マスターから最新のブロック一覧を取得
    //   const masterBlocks = await getMasterBlocks();
    //   // 選択された type に一致する最新のマスターデータを取得（見つからなければ渡されたものを使用）
    //   const latestMasterBlock =
    //     masterBlocks.find((b) => b.type === masterBlock.type) ?? masterBlock;
    //   // 2. ステートの更新
    //   setSite((prevSite) => {
    //     const sections = prevSite.layout?.sections ?? [];
    //     // 対象のセクション（末尾のセクション、無ければそのまま返す）
    //     const targetSectionIndex =
    //       sections.length > 0 ? sections.length - 1 : 0;
    //     const targetSection = sections[targetSectionIndex];
    //     if (!targetSection) return prevSite;
    //     // 最新のマスターデータから新しい SiteBlock を生成
    //     const currentBlockCount = targetSection.blocks?.length ?? 0;
    //     const newBlock = buildSiteBlockFromMaster(
    //       targetSection.id,
    //       latestMasterBlock,
    //       currentBlockCount,
    //     );
    //     // セクション配列の更新
    //     const updatedSections = sections.map((sec, idx) => {
    //       if (idx === targetSectionIndex) {
    //         return {
    //           ...sec,
    //           blocks: [...(sec.blocks ?? []), newBlock],
    //         };
    //       }
    //       return sec;
    //     });
    //     return {
    //       ...prevSite,
    //       layout: {
    //         ...prevSite.layout,
    //         sections: updatedSections,
    //       },
    //     };
    //   });
    // } catch (error) {
    //   console.error("Failed to fetch master blocks on adding:", error);
    // }
  };

  const handleUpdateSection = (
    sectionId: string,
    updatedFields: Partial<Omit<Section, "id" | "blocks">>,
  ) => {
    setSite((prevSite) => {
      const nextSections = prevSite.layout.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            ...updatedFields,
            ...(updatedFields.data && {
              data: {
                ...section.data,
                ...updatedFields.data,
              },
            }),
          };
        }
        return section;
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
          user={user}
          mode="edit"
          newsItems={newsItems}
          onUpdateBlock={handleUpdateBlock}
          onUpdateSection={handleUpdateSection}
          onOpenMetaEditor={() => setIsMetaOpen(true)}
          onOpenMenuEditor={() => setIsMenuOpen(true)}
          onOpenBlockEditor={() => setIsBlockModalOpen(true)} // 👈 Template（Toolbar）へ伝達
        />
      </ImagePickerProvider>

      {/* 基本情報編集モーダル */}
      <MetaModal
        isOpen={isMetaOpen}
        onClose={() => setIsMetaOpen(false)}
        initialData={site.meta}
        onSave={handleSaveMeta}
      />

      {/* ナビゲーションメニュー編集モーダル */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        initialData={site.navigation?.menu ?? []}
        onSave={handleSaveMenu}
      />

      {/* ➕ ブロック追加モーダル */}
      <BlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onSelectBlock={handleAddBlockFromMaster}
      />
    </>
  );
}
