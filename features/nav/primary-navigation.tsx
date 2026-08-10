"use client";

import Link from "next/link";
import { DropDownMenu } from "../menu/drop-down-menu";
import { LinkButtonHeader } from "@/components/buttons/link-button";
import { ShareButtonHeader } from "@/components/buttons/share-button";
import { SiteData } from "@/types/site";
import { UserData } from "@/types/user";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site?: SiteData;
  user?: UserData;
  newsItems: NewsItem[];
};

export function PrimaryNavigation(props: Props) {
  const { site, user, newsItems } = props;

  // 1. ポータル時（site がない場合）
  if (!site) {
    return (
      <nav className="hidden h-full items-center gap-4 md:flex">
        <DropDownMenu
          menu={[{ label: "お知らせ", type: "news" }]}
          newsItems={newsItems}
        />

        {/* 💡 ポータルで、かつ未ログインの時だけログインボタンを表示 */}
        {!user && (
          <>
            <div className="h-4 w-px bg-slate-200" />
            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-blue-700"
            >
              ログイン
            </Link>
          </>
        )}
      </nav>
    );
  }

  // 2. 店舗サイト時（site がある場合）: ログインボタンは出さない
  const displayMenu = [...(site.navigation?.menu ?? [])];

  const sortedSocialLinks = [...(site.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const headerSocialLinks = sortedSocialLinks.slice(0, 2);

  return (
    <nav className="hidden h-full items-center gap-4 md:flex">
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