"use client";

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import BaseSection from "@/features/section/components/base-section";
import { Section } from "@/features/section/types"; // 👈 SectionData から Section に変更
import { SiteData, SiteMode } from "@/types/site";
import { NewsItem } from "@/features/block/news/types";
import { UserData } from "@/types/user";

type Props = {
  site: SiteData;
  mode?: SiteMode;
  newsItems: NewsItem[];
  user?: UserData;
  onUpdateBlock?: (blockId: string, updatedData: Record<string, any>) => void;
  onUpdateSection?: (
    sectionId: string,
    updatedFields: Record<string, any>,
  ) => void;
  onOpenMetaEditor?: () => void;
  onOpenMenuEditor?: () => void;
};

export default function Template(props: Props) {
  const {
    site,
    mode = "view",
    newsItems,
    user,
    onUpdateBlock,
    onUpdateSection,
    onOpenMetaEditor,
    onOpenMenuEditor,
  } = props;
  const sections = site?.layout?.sections;

  return (
    <div>
      <Header
        site={site}
        newsItems={newsItems}
        user={user}
        onOpenMenuEditor={onOpenMenuEditor}
      />

      {sections?.map(
        (
          section: Section,
          sectionIndex: number, // 👈 ここも Section に変更
        ) => (
          <BaseSection
            key={section.id ?? sectionIndex}
            meta={site.meta}
            section={{ ...section }}
            mode={mode}
            onUpdateBlock={onUpdateBlock ?? (() => {})}
            onUpdateSection={onUpdateSection ?? (() => {})}
            onOpenMetaEditor={onOpenMetaEditor ?? (() => {})}
          />
        ),
      )}

      <Footer site={site} mode={mode} />
    </div>
  );
}
