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
  // 💡 型を引数ありに変更
  onUpdateBlock?: (blockId: string, updatedData: Record<string, any>) => void;
};

export default function Template(props: Props) {
  const { site, edit, newsItems, onUpdateBlock } = props;
  const sections = site?.layout?.sections;

  return (
    <div>
      <Header site={site} newsItems={newsItems} />

      {sections?.map((section: SectionData, sectionIndex: number) => (
        <BaseSection
          key={section.id ?? sectionIndex}
          meta={site.meta}
          section={{ ...section }}
          edit={edit}
          // 💡 空の関数にも型を合わせておく
          onUpdateBlock={onUpdateBlock ?? (() => {})}
        />
      ))}

      <Footer site={site} edit={edit} />
    </div>
  );
}