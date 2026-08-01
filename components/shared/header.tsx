// components/shared/header.tsx
"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/logos/logo";
import { PrimaryNavigation } from "@/features/nav/primary-navigation";
import { MobileNavigation } from "@/features/nav/mobile-navigation";
import { Toolbar } from "@/components/navigations/toolbar";
import { SiteData } from "@/types/site";
import { UserData } from "@/types/user";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  site?: SiteData;
  user?: UserData;
  newsItems: NewsItem[];
  onOpenMenuEditor?: () => void;
};

export default function Header(props: Props) {
  const { site, user, newsItems, onOpenMenuEditor } = props;
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // 🛠 編集・管理機能が必要なシーン（ダッシュボード、または編集関数が渡されている時）
  const showToolbar = isDashboard || !!onOpenMenuEditor;

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      {/* 1段目: システム操作・ログイン案内・編集ボタン */}
      {showToolbar && (
        <Toolbar user={user} onOpenMenuEditor={onOpenMenuEditor} />
      )}

      {/* 2段目: 純粋なサイトヘッダー（閲覧時も編集時も共通） */}
      <header className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4 text-sm text-gray-800 tracking-tight shadow-sm">
        <Logo site={site} />

        {/* ナビゲーション本体はシンプルにデータだけを渡す */}
        <PrimaryNavigation user={user} site={site} newsItems={newsItems} />
        <MobileNavigation user={user} site={site} newsItems={newsItems} />
      </header>
    </div>
  );
}
