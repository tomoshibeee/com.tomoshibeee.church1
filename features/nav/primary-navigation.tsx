"use client";

import { DropDownMenu } from "../menu/drop-down-menu";
import { LinkButtonHeader } from "@/components/buttons/link-button";
import { ShareButtonHeader } from "@/components/buttons/share-button";
import { SiteData } from "@/types/site";
import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types";
import { UserData } from "@/types/user";
import { LoginButton, SignupButton } from "@/components/buttons/auth/index";

type Props = {
  site?: SiteData;
  user?: UserData;
  newsItems: NewsItem[]; // 💡 ドロワーを開く関数ではなく、お知らせデータ自体を受け取るように変更
  onOpenMenuEditor?: () => void; // 💡 メニュー編集モーダルを開く関数を受け取るように変更
};

export function PrimaryNavigation(props: Props) {
  const { site, user, newsItems, onOpenMenuEditor } = props;

  // ----------------------------------------------------
  // パターンA: 完全に初期状態などで site すらない場合（トップページやダッシュボード等）
  // ----------------------------------------------------
  if (!site) {
    // 💡 user が存在するとき（ログイン時）のメニュー構造
    const userMenu: MenuItem[] = [
      { label: "お知らせ", type: "news" },
      {
        label: user?.name ?? "",
        icon: user?.avator,
        children: [{ label: "ログアウト", type: "logout" }],
      },
    ];

    return (
      <nav className="hidden h-full md:flex items-center gap-4">
        {user ? (
          /* ログイン済みの表示 */
          <DropDownMenu menu={userMenu} newsItems={newsItems} />
        ) : (
          /* 未ログイン時（トップページ等）の表示 */
          <div className="flex items-center gap-3">
            <DropDownMenu
              menu={[{ label: "お知らせ", type: "news" }]}
              newsItems={newsItems}
            />
            <LoginButton />
            <SignupButton />
          </div>
        )}

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
      <DropDownMenu
        key={JSON.stringify(displayMenu)} // 👈 これを追加！
        menu={displayMenu}
        newsItems={newsItems}
      />

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
