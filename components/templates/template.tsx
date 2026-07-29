"use client";

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import BaseSection from "@/features/section/components/base-section";
import { SectionData } from "@/features/section/types";
import { SiteData, SiteMode } from "@/types/site";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site: SiteData;
  mode?: SiteMode;
  newsItems: NewsItem[];
  onUpdateBlock?: (blockId: string, updatedData: Record<string, any>) => void;
  onUpdateSection?: (sectionId: string, updatedFields: Record<string, any>) => void;
  onOpenMetaEditor?: () => void;
  onOpenMenuEditor?: () => void;
};

export default function Template(props: Props) {
  const { site, mode = "view", newsItems, onUpdateBlock, onUpdateSection, onOpenMetaEditor, onOpenMenuEditor } = props;
  const sections = site?.layout?.sections;

  return (
    <div>
      <Header site={site} newsItems={newsItems} onOpenMenuEditor={onOpenMenuEditor} />

      {sections?.map((section: SectionData, sectionIndex: number) => (
        <BaseSection
          key={section.id ?? sectionIndex}
          meta={site.meta}
          section={{ ...section }}
          mode={mode}
          onUpdateBlock={onUpdateBlock ?? (() => {})}
          onUpdateSection={onUpdateSection ?? (() => {})}
          onOpenMetaEditor={onOpenMetaEditor ?? (() => {})}
        />
      ))}

      <Footer site={site} mode={mode} />
    </div>
  );
}