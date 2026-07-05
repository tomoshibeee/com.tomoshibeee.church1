"use client";

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

  // ----------------------------------------------------
  // パターンA: 完全に初期状態などで site すらない場合のフォールバック
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
      {
        label: user?.name ?? "",
        icon: user?.avator,
        children: [{ label: "ログアウト", type: "logout" }],
      },
    ];
    return (
      <nav className="flex h-full md:hidden items-center gap-4">
        <HamburgerMenu menu={defaultMenu} newsItems={newsItems} />
      </nav>
    );
  }

  // ----------------------------------------------------
  // パターンB: 通常時（/dashboard/[site_id] も含む、site がある状態）
  // ----------------------------------------------------

  // ⭕️ 公開サイトの純粋なメニュー配列をそのまま使う
  const displayMenu = site.navigation?.menu ?? [];

  // ✂️ 【削除】if (onOpenMenuEditor) { displayMenu.push(...) } の処理を完全に撤去！
  // これにより、ハンバーガーメニューの末尾に「メニュー編集 ⚙️」が勝手に付くのを防ぎます。

  const sortedSocialLinks = [...(site?.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const headerSocialLinks = sortedSocialLinks.slice(0, 2);

  return (
    <nav className="flex h-full md:hidden items-center gap-3">
      {/* SNSリンクの塊 */}
      <div className="flex items-center gap-1">
        {headerSocialLinks.map((item) => (
          <LinkButtonHeader key={item.id} item={item} />
        ))}
      </div>

      {/* 📐 仕切り線 */}
      <div className="h-4 w-px bg-slate-200" />

      {/* 共有ボタン */}
      <ShareButtonHeader />

      {/* ⭕️ メニュー編集はこの直生の「⚙️」ボタンだけでスマートに担当！ */}
      {onOpenMenuEditor && (
        <button
          type="button"
          onClick={onOpenMenuEditor}
          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center"
          title="メニュー編集"
        >
          <span className="text-base leading-none">⚙️</span>
        </button>
      )}

      {/* ハンバーガーメニュー（純粋なサイトメニューだけが渡り、かつリアルタイムに更新される） */}
      <HamburgerMenu
        key={JSON.stringify(displayMenu)}
        menu={displayMenu}
        newsItems={newsItems}
      />
    </nav>
  );
}