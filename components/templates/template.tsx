"use client";

import { useState } from "react"; // 👈 1. useState をインポート
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
    onUpdateBlock,
    onUpdateSection,
    onOpenMetaEditor,
    onOpenMenuEditor,
    onOpenBlockEditor,
  } = props;

  // 👈 2. 選択中の Section ID を保持する State を追加
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );

  const sections = site?.layout?.sections;

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
          // 👈 3. 選択状態と選択時の処理を BaseSection に渡す
          isSelected={selectedSectionId === section.id}
          onSelect={(id) => setSelectedSectionId(id)}
          onUpdateBlock={onUpdateBlock ?? (() => {})}
          onUpdateSection={onUpdateSection ?? (() => {})}
          onOpenMetaEditor={onOpenMetaEditor ?? (() => {})}
        />
      ))}

      <Footer site={site} mode={mode} />
    </div>
  );
}
