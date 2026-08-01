"use client";

import { DropDownMenu } from "../menu/drop-down-menu";
import { LinkButtonHeader } from "@/components/buttons/link-button";
import { ShareButtonHeader } from "@/components/buttons/share-button";
import { SiteData } from "@/types/site";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site?: SiteData;
  newsItems: NewsItem[];
};

export function PrimaryNavigation(props: Props) {
  const { site, newsItems } = props;

  // site がない場合（初期状態など）は「お知らせ」メニューのみを表示
  if (!site) {
    return (
      <nav className="hidden h-full md:flex items-center gap-4">
        <DropDownMenu
          menu={[{ label: "お知らせ", type: "news" }]}
          newsItems={newsItems}
        />
      </nav>
    );
  }

  // 通常時（site がある状態）
  const displayMenu = [...(site.navigation?.menu ?? [])];

  const sortedSocialLinks = [...(site.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  );
  const headerSocialLinks = sortedSocialLinks.slice(0, 2);

  return (
    <nav className="hidden h-full md:flex items-center gap-4">
      <DropDownMenu
        key={JSON.stringify(displayMenu)}
        menu={displayMenu}
        newsItems={newsItems}
      />

      {headerSocialLinks.length > 0 && (
        <>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            {headerSocialLinks.map((item) => (
              <LinkButtonHeader key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      <div className="h-4 w-px bg-slate-200" />

      <ShareButtonHeader />
    </nav>
  );
}