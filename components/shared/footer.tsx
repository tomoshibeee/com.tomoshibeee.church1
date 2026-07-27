// components/Footer.tsx
"use client";

import { usePathname } from "next/navigation";
import { SiteData, SiteMode } from "@/types/site";

import PortalFooter from "@/components/footers/portal-footer";
import DashboardFooter from "@/components/footers/dashboard-footer";
import SiteFooter from "@/components/footers/site-footer";

type Props = {
  site?: SiteData;
  mode?: SiteMode;
};

export default function Footer({ site, mode = "view" }: Props) {
  const pathname = usePathname();

  const isTop = pathname === "/";
  const isDashboard = pathname?.startsWith("/dashboard");

  // 1. ポータル（トップページ）用フッター
  if (isTop) {
    return <PortalFooter />;
  }

  // 2. ダッシュボード用フッター（サイトデータがない一覧画面のみ）
  if (isDashboard && !site) {
    return <DashboardFooter />;
  }

  // 3. 一般サイト（公開画面 ＆ 編集画面）用フッター
  if (!site) return null;
  return <SiteFooter site={site} mode={mode} />;
}