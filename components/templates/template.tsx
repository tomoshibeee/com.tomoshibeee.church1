"use client";

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import BaseSection from "@/features/section/components/base-section";
import { Section } from "@/features/section/types";
import { SiteData, SiteMode } from "@/types/site";
import { NewsItem } from "@/features/block/news/types";
import { UserData } from "@/types/user";

type Props = {
  site: SiteData;
  mode?: SiteMode;
  newsItems: NewsItem[];
  user?: UserData;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onUpdateBlock?: (blockId: string, updatedData: Record<string, any>) => void;
  onUpdateSection?: (
    sectionId: string,
    updatedFields: Record<string, any>,
  ) => void;
  onOpenMetaEditor?: () => void;
  onOpenMenuEditor?: () => void;
  onOpenBlockEditor?: () => void;
};

export default function Template(props: Props) {
  const {
    site,
    mode = "view",
    newsItems,
    user,
    selectedSectionId,
    onSelectSection,
    onUpdateBlock,
    onUpdateSection,
    onOpenMetaEditor,
    onOpenMenuEditor,
    onOpenBlockEditor,
  } = props;

  const sections = site?.layout?.sections;

  const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
    if (!sections || !onUpdateSection) return;

    const targetSection = sections.find((sec) =>
      sec.blocks?.some((b) => b.id === blockId),
    );

    if (!targetSection || !targetSection.blocks) return;

    const blocks = targetSection.blocks;
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, movedBlock);

    const reorderedBlocks = newBlocks.map((block, idx) => ({
      ...block,
      display_order: idx + 1,
    }));

    onUpdateSection(targetSection.id, {
      blocks: reorderedBlocks,
    });
  };

  return (
    <div>
      <Header
        site={site}
        newsItems={newsItems}
        user={user}
        onOpenMenuEditor={onOpenMenuEditor}
        onOpenBlockEditor={onOpenBlockEditor}
      />

      {sections?.map((section: Section, sectionIndex: number) => (
        <BaseSection
          key={section.id ?? sectionIndex}
          meta={site.meta}
          section={{ ...section }}
          mode={mode}
          isSelected={selectedSectionId === section.id}
          onSelect={(id) => onSelectSection?.(id)}
          onUpdateBlock={onUpdateBlock ?? (() => {})}
          onUpdateSection={onUpdateSection ?? (() => {})}
          onOpenMetaEditor={onOpenMetaEditor ?? (() => {})}
          onMoveBlock={handleMoveBlock}
        />
      ))}

      <Footer site={site} mode={mode} />
    </div>
  );
}
