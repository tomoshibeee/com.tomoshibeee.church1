// components/footers/PortalFooter.tsx
"use client";

export default function PortalFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-900 py-8 text-center text-sm text-slate-400">
      <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* PortalNavigationの内容をここに配置 */}
        <div className="flex gap-6">
          <a href="/features" className="hover:text-white transition">
            機能紹介
          </a>
          <a href="/pricing" className="hover:text-white transition">
            料金プラン
          </a>
          <a href="/contact" className="hover:text-white transition">
            お問い合わせ
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Portal Service. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
