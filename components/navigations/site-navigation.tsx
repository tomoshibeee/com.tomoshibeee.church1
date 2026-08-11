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
import { getMasterBlocks } from "@/services/master-block-service";
import { Block } from "@/features/block/index";

type Props = {
  site: SiteData;
  newsItems: NewsItem[];
  user?: UserData;
};

export default function SiteNavigation(props: Props) {
  const { site: initialSite, newsItems, user } = props;
  const [site, setSite] = useState<SiteData>(initialSite);

  // 選択中セクションのID管理
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );

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
    // site の指定された SectionID のセクションの末尾に MasterBlock から生成したブロックを挿入する
    try {
      const masterBlocks = await getMasterBlocks();
      const latestMasterBlock =
        masterBlocks.find((b) => b.type === masterBlock.type) ?? masterBlock;

      setSite((prevSite) => {
        const sections = prevSite.layout?.sections ?? [];
        if (sections.length === 0) return prevSite;

        const targetIndex = selectedSectionId
          ? sections.findIndex((sec) => sec.id === selectedSectionId)
          : sections.length - 1;

        const effectiveIndex =
          targetIndex !== -1 ? targetIndex : sections.length - 1;
        const targetSection = sections[effectiveIndex];
        if (!targetSection) return prevSite;

        // 💡 UI 用の Block オブジェクトを組み立てる
        const newBlock: Block = {
          id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type: latestMasterBlock.type,
          variant: latestMasterBlock.default_variant ?? "default",
          data: latestMasterBlock.default_data ?? null,
        } as Block;

        const updatedSections = sections.map((sec, idx) => {
          if (idx === effectiveIndex) {
            return {
              ...sec,
              blocks: [...(sec.blocks ?? []), newBlock],
            };
          }
          return sec;
        });

        return {
          ...prevSite,
          layout: {
            ...prevSite.layout,
            sections: updatedSections,
          },
        };
      });
    } catch (error) {
      console.error("Failed to fetch master blocks on adding:", error);
    }
  };

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
          selectedSectionId={selectedSectionId}
          onSelectSection={setSelectedSectionId}
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
