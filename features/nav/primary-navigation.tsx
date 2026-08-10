"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // 1. ポータル時（site がない場合）
  if (!site) {
    return (
      <nav className="hidden h-full items-center gap-4 md:flex">
        <DropDownMenu
          menu={[{ label: "お知らせ", type: "news" }]}
          newsItems={newsItems}
        />

        {/* 未ログイン時: ログインボタン */}
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

        {/* ログイン済み時 */}
        {user && (
          <>
            {/* ダッシュボード外にいる時だけダッシュボードリンクを表示 */}
            {!isDashboard && (
              <>
                <div className="h-4 w-px bg-slate-200" />
                <Link
                  href="/dashboard"
                  className="rounded-full bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
                >
                  ダッシュボード
                </Link>
              </>
            )}

            {/* ログアウトボタン（少し控えめなスタイルに調整） */}
            <div className="h-4 w-px bg-slate-200" />
            <Link
              href="/logout"
              className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              ログアウト
            </Link>
          </>
        )}
      </nav>
    );
  }

  // 2. 店舗サイト時（site がある場合）
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
