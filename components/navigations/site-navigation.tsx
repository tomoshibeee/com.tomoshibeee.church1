"use client";

import { useState, useEffect } from "react";
import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { ImagePickerProvider } from "@/components/image-picker";
import { MetaModal } from "@/features/meta/components/meta-modal";
import { MenuModal } from "@/features/menu/components/menu-modal";
import { BlockModal } from "@/features/block/components/block-modal";
import { MetaData } from "@/types/site-meta";
import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types";
import { UserData } from "@/types/user";
import { Section } from "@/features/section/types";
import { MasterBlock } from "@/models/master-block";

type Props = {
  site: SiteData;
  newsItems: NewsItem[];
  user?: UserData;
};

export default function SiteNavigation(props: Props) {
  const { site: initialSite, newsItems, user } = props;
  const [site, setSite] = useState<SiteData>(initialSite);

  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    if (site?.meta?.site_id) {
      localStorage.setItem(
        `preview-${site.meta.site_id}`,
        JSON.stringify(site),
      );
    }
  }, [site]);

  const handleSaveMeta = async (updatedMeta: MetaData) => {
    setSite((prevSite) => ({
      ...prevSite,
      meta: {
        ...prevSite.meta,
        ...updatedMeta,
      },
    }));
  };

  const handleSaveMenu = async (updatedMenu: MenuItem[]) => {
    setSite((prevSite) => ({
      ...prevSite,
      navigation: {
        ...prevSite.navigation,
        menu: updatedMenu,
      },
    }));
  };

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

  // 💡 blocksの更新（並び替え）も受け取れるように型と更新ロジックを修正
  const handleUpdateSection = (
    sectionId: string,
    updatedFields: Partial<Section>,
  ) => {
    setSite((prevSite) => {
      const nextSections = prevSite.layout.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            ...updatedFields,
            ...(updatedFields.blocks && {
              blocks: updatedFields.blocks,
            }),
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
          onOpenBlockEditor={() => setIsBlockModalOpen(true)}
        />
      </ImagePickerProvider>

      <MetaModal
        isOpen={isMetaOpen}
        onClose={() => setIsMetaOpen(false)}
        initialData={site.meta}
        onSave={handleSaveMeta}
      />

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        initialData={site.navigation?.menu ?? []}
        onSave={handleSaveMenu}
      />

      <BlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onSelectBlock={handleAddBlockFromMaster}
      />
    </>
  );
}
