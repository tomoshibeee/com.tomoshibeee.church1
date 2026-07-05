"use client";

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import BaseSection from "@/features/section/components/base-section";
import { SectionData } from "@/features/section/types";
import { SiteData } from "@/types/site";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site: SiteData;
  edit?: boolean;
  newsItems: NewsItem[];
  onUpdateBlock?: (blockId: string, updatedData: Record<string, any>) => void;
  onOpenMetaEditor?: () => void;
  onOpenMenuEditor?: () => void;
};

export default function Template(props: Props) {
  const { site, edit, newsItems, onUpdateBlock, onOpenMetaEditor, onOpenMenuEditor } = props;
  const sections = site?.layout?.sections;

  return (
    <div>
      <Header site={site} newsItems={newsItems} onOpenMenuEditor={onOpenMenuEditor} />

      {sections?.map((section: SectionData, sectionIndex: number) => (
        <BaseSection
          key={section.id ?? sectionIndex}
          meta={site.meta}
          section={{ ...section }}
          edit={edit}
          onUpdateBlock={onUpdateBlock ?? (() => {})}
          onOpenMetaEditor={onOpenMetaEditor ?? (() => {})}
        />
      ))}

      <Footer site={site} edit={edit} />
    </div>
  );
}