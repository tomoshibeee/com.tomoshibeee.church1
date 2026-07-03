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
};

export function PrimaryNavigation(props: Props) {
  const { site, user, newsItems } = props;

  if (!site) {
    const menu: MenuItem[] = [
      { label: "お知らせ", type: "news" },
      {
        label: user?.name ?? "",
        icon: user?.avator,
        children: [{ label: "ログアウト", type: "logout" }],
      },
    ];
    return (
      <nav className="hidden h-full md:flex items-center gap-6">
        <DropDownMenu menu={menu} newsItems={newsItems} />
      </nav>
    );
  }

  const sortedSocialLinks = [...(site.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const headerSocialLinks = sortedSocialLinks.slice(0, 2);

  return (
    // 💡 gap-4 で全体を程よい間隔に。無駄な pl-2 などを徹底排除して等間隔化！
    <nav className="hidden h-full md:flex items-center gap-4">
      <DropDownMenu menu={site.navigation?.menu ?? []} newsItems={newsItems} />

      {/* 📐 仕切り線をほんの少しマイルドなslate-200に */}
      <div className="h-4 w-px bg-slate-200" />

      <div className="flex items-center gap-1.5">
        {headerSocialLinks.map((item) => (
          <LinkButtonHeader key={item.id} item={item} />
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200" />

      <ShareButtonHeader />
    </nav>
  );
}
