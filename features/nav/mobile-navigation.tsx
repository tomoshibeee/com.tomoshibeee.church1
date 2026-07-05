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
      // 💡 もしDropDownMenuやHamburgerMenu側がonClickを受け取れる作りならこれで動きます
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

  // ⭕️ 既存の公開サイトメニューのコピーを作る
  const displayMenu = [...(site.navigation?.menu ?? [])];

  // ⭕️ もしダッシュボード（onOpenMenuEditorが存在する）なら、ハンバーガーメニューの中に「メニュー編集」項目を動的に追加！
  // ※ もしHamburgerMenuの中身をクリックした時にonClickが発火しない仕様の場合は、
  // 下の JSX の HamburgerMenu の横に直接 <button> を置く形に切り替えてください
  if (onOpenMenuEditor) {
    displayMenu.push({
      label: "メニュー編集 ⚙️",
      type: "link", // 型定義に合わせて調整してください
      // onClick: onOpenMenuEditor, // 💡 ハンバーガー側がonClick対応ならこれを開通させる
    });
  }

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

      {/* ⭕️ 解決策：ハンバーガーメニューの左隣に、直生で「メニュー編集」のギアボタンを置く！ */}
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

      {/* ハンバーガーメニュー（site.navigation.menu の純粋な公開メニューだけを渡す） */}
      <HamburgerMenu menu={site.navigation?.menu ?? []} newsItems={newsItems} />
    </nav>
  );
}
