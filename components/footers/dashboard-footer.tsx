// components/footers/DashboardFooter.tsx
"use client";
import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-4 text-xs text-slate-500">
      <div className="px-6 flex justify-between items-center">
        {/* DashboardNavigationの内容をここに配置 */}
        <div className="flex gap-4">
          <Link
            href="/dashboard/help"
            className="hover:text-slate-800 transition font-medium"
          >
            ヘルプセンター
          </Link>
          <Link
            href="/dashboard/terms"
            className="hover:text-slate-800 transition"
          >
            利用規約
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Dashboard Control Panel</p>
      </div>
    </footer>
  );
}
