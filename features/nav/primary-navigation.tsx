"use client";

import { DropDownMenu } from "../menu/drop-down-menu";
import { LinkButtonHeader } from "@/components/buttons/link-button";
import { ShareButtonHeader } from "@/components/buttons/share-button";
import { SiteData } from "@/types/site";
import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types";
import { UserData } from "@/types/user";

type Props = {
  site?: SiteData;
  user?: UserData;
  newsItems: NewsItem[]; // 💡 ドロワーを開く関数ではなく、お知らせデータ自体を受け取るように変更
  onOpenMenuEditor?: () => void; // 💡 メニュー編集モーダルを開く関数を受け取るように変更
};

export function PrimaryNavigation(props: Props) {
  const { site, user, newsItems, onOpenMenuEditor } = props;

  // ----------------------------------------------------
  // パターンA: 完全に初期状態などで site すらない場合のフォールバック（ダッシュボードはここを通っている）
  // ----------------------------------------------------
  if (!site) {
    const defaultMenu: MenuItem[] = [
      { label: "お知らせ", type: "news" },
      // 💡 DropDownMenu の中から「メニュー編集」を削除します（動かない・見えない原因になるため）
      {
        label: user?.name ?? "",
        icon: user?.avator,
        children: [{ label: "ログアウト", type: "logout" }],
      },
    ];
    return (
      <nav className="hidden h-full md:flex items-center gap-4">
        {" "}
        {/* gapを4に統一 */}
        <DropDownMenu menu={defaultMenu} newsItems={newsItems} />
        {/* ⭕️ 解決策：DropDownMenu の外側に直接ボタンを配置する！ */}
        {onOpenMenuEditor && (
          <button
            type="button"
            onClick={onOpenMenuEditor}
            className="ml-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            メニュー編集 ⚙️
          </button>
        )}
      </nav>
    );
  }

  // ----------------------------------------------------
  // パターンB: 通常時（site がある状態）
  // ----------------------------------------------------
  const displayMenu = [...(site.navigation?.menu ?? [])];

  const sortedSocialLinks = [...(site.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const headerSocialLinks = sortedSocialLinks.slice(0, 2);

  return (
    <nav className="hidden h-full md:flex items-center gap-4">
      <DropDownMenu menu={displayMenu} newsItems={newsItems} />

      <div className="h-4 w-px bg-slate-200" />

      <div className="flex items-center gap-1.5">
        {headerSocialLinks.map((item) => (
          <LinkButtonHeader key={item.id} item={item} />
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200" />

      <ShareButtonHeader />

      {/* ⭕️ 通常ルートのときも、同じように外側にボタンを配置する */}
      {onOpenMenuEditor && (
        <button
          type="button"
          onClick={onOpenMenuEditor}
          className="ml-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          メニュー編集 ⚙️
        </button>
      )}
    </nav>
  );
}
