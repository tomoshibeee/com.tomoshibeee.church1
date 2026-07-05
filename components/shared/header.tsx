"use client";

import { usePathname } from "next/navigation";

import { Logo } from "@/components/logos/logo";
import { PrimaryNavigation } from "@/features/nav/primary-navigation";
import { MobileNavigation } from "@/features/nav/mobile-navigation";
import { SiteData } from "@/types/site";
import { UserData } from "@/types/user";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site?: SiteData;
  user?: UserData;
  newsItems: NewsItem[]; // 💡 ドロワーを開く関数ではなく、お知らせデータ自体を受け取るように変更
  onOpenMenuEditor?: () => void; // 💡 メニュー編集モーダルを開く関数を受け取るように変更
};

export default function Header(props: Props) {
  const { site, user, newsItems, onOpenMenuEditor } = props;

  const pathname = usePathname();

  const isTop = pathname === "/";
  const isDashboard = pathname?.startsWith("/dashboard");

  const baseClass =
    "sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4 text-sm text-gray-800 tracking-tight shadow-sm";

  if (isTop) {
    return (
      <header className={baseClass}>
        <Logo />
        <PrimaryNavigation newsItems={newsItems} />
        <MobileNavigation newsItems={newsItems} />
      </header>
    );
  }
  if (isDashboard) {
    return (
      <header className={baseClass}>
        <Logo />
        <PrimaryNavigation
          user={user}
          site={site}
          newsItems={newsItems}
          onOpenMenuEditor={onOpenMenuEditor}
        />
        <MobileNavigation
          user={user}
          site={site}
          newsItems={newsItems}
          onOpenMenuEditor={onOpenMenuEditor}
        />
      </header>
    );
  }

  return (
    <header className={baseClass}>
      {site && (
        <>
          <Logo site={site} />
          <PrimaryNavigation
            site={site}
            newsItems={newsItems}
            onOpenMenuEditor={onOpenMenuEditor}
          />
          <MobileNavigation
            site={site}
            newsItems={newsItems}
            onOpenMenuEditor={onOpenMenuEditor}
          />
        </>
      )}
    </header>
  );
}
