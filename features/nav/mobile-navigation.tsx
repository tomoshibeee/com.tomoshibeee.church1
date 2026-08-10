"use client";

import { usePathname } from "next/navigation";
import { HamburgerMenu } from "@/features/menu/hamburger-menu";
import { LinkButtonHeader } from "@/components/buttons/link-button";
import { ShareButtonHeader } from "@/components/buttons/share-button";
import { SiteData } from "@/types/site";
import { UserData } from "@/types/user";
import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site?: SiteData;
  user?: UserData;
  newsItems: NewsItem[];
  onOpenMenuEditor?: () => void;
};

export function MobileNavigation(props: Props) {
  const { site, user, newsItems, onOpenMenuEditor } = props;
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // ----------------------------------------------------
  // パターンA: ポータル時（site がない場合）
  // ----------------------------------------------------
  if (!site) {
    const defaultMenu: MenuItem[] = [
      { label: "お知らせ", type: "news" },
      ...(onOpenMenuEditor
        ? [
            {
              label: "メニュー編集",
              type: "link" as const,
              onClick: onOpenMenuEditor,
            },
          ]
        : []),
      // 未ログイン時：ログイン / 新規登録
      ...(!user
        ? [
            { label: "ログイン", href: "/login", type: "link" as const },
            { label: "新規登録", href: "/signup", type: "link" as const },
          ]
        : []),
      // ログイン済み時
      ...(user
        ? [
            // ダッシュボード外の時のみダッシュボードを表示
            ...(!isDashboard
              ? [
                  {
                    label: "ダッシュボード",
                    href: "/dashboard",
                    type: "link" as const,
                  },
                ]
              : []),
            // ログアウト項目を追加
            {
              label: "ログアウト",
              href: "/logout",
              type: "link" as const,
            },
          ]
        : []),
    ];

    return (
      <nav className="flex h-full items-center gap-4 md:hidden">
        <HamburgerMenu menu={defaultMenu} newsItems={newsItems} />
      </nav>
    );
  }

  // ----------------------------------------------------
  // パターンB: 店舗サイト時（site がある場合）
  // ----------------------------------------------------
  const displayMenu: MenuItem[] = [...(site.navigation?.menu ?? [])];

  const sortedSocialLinks = [...(site?.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const headerSocialLinks = sortedSocialLinks.slice(0, 2);

  return (
    <nav className="flex h-full items-center gap-3 md:hidden">
      {/* SNSリンク */}
      <div className="flex items-center gap-1">
        {headerSocialLinks.map((item) => (
          <LinkButtonHeader key={item.id} item={item} />
        ))}
      </div>

      {/* 仕切り線 */}
      <div className="h-4 w-px bg-slate-200" />

      {/* 共有ボタン */}
      <ShareButtonHeader />

      {/* メニュー編集ボタン（編集モード時） */}
      {onOpenMenuEditor && (
        <button
          type="button"
          onClick={onOpenMenuEditor}
          className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
          title="メニュー編集"
        >
          <span className="text-base leading-none">⚙️</span>
        </button>
      )}

      {/* ハンバーガーメニュー */}
      <HamburgerMenu
        key={JSON.stringify(displayMenu)}
        menu={displayMenu}
        newsItems={newsItems}
      />
    </nav>
  );
}
