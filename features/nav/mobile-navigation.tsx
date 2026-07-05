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
  newsItems: NewsItem[]; // 💡 ドロワーを開く関数ではなく、お知らせデータ自体を受け取るように変更
  onOpenMenuEditor?: () => void; // 💡 メニュー編集モーダルを開く関数を受け取るように変更
};

export function MobileNavigation(props: Props) {
  const { site, user, newsItems, onOpenMenuEditor } = props;

  if (!site) {
    const menu: MenuItem[] = [
      { label: "お知らせ", type: "news" },
      {
        label: "メニュー編集",
        type: "menu-editor",
        onClick: onOpenMenuEditor,
      },
      {
        label: user?.name ?? "",
        icon: user?.avator,
        children: [{ label: "ログアウト", type: "logout" }],
      },
    ];
    return (
      <nav className="flex h-full md:hidden items-center gap-4">
        <HamburgerMenu menu={menu} newsItems={newsItems} />
      </nav>
    );
  }

  const sortedSocialLinks = [...(site?.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const headerSocialLinks = sortedSocialLinks.slice(0, 2);

  return (
    // 💡 スマホ版も PC版と全く同じ美的なロジック（等間隔 ＋ 仕切り線）を適用！
    <nav className="flex h-full md:hidden items-center gap-3">
      {/* SNSリンクの塊 */}
      <div className="flex items-center gap-1">
        {headerSocialLinks.map((item) => (
          <LinkButtonHeader key={item.id} item={item} />
        ))}
      </div>
      {/* 📐 スマホにも仕切り線を入れることで、「外部SNS」と「自サイトの機能」が直感的に分離します */}
      <div className="h-4 w-px bg-slate-200" />
      {/* 共有ボタン */}
      <ShareButtonHeader />
      {/* ハンバーガーメニュー */}
      <HamburgerMenu menu={site.navigation?.menu ?? []} newsItems={newsItems} />
      s{" "}
    </nav>
  );
}
