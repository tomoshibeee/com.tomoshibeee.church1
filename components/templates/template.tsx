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
  newsItems: NewsItem[]; // 💡 ドロワーを開く関数ではなく、お知らせデータ自体を受け取るように変更
  onUpdateBlock?: () => void;
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
          onUpdateBlock={onUpdateBlock ?? (() => {})}
        />
      ))}

      <Footer site={site} edit={edit} />
    </div>
  );
}
