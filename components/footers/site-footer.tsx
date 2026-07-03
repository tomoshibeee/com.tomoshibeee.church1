// components/footers/SiteFooter.tsx
"use client";

import { LinkButtonFooter } from "@/components/buttons/link-button";
import { ShareButtonFooter } from "../buttons/share-button";
import { SiteSocialLink } from "@/models/site-social-link";
import { SiteData } from "@/types/site";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";

type SiteFooterProps = {
  site: SiteData;
  edit?: boolean;
};

export default function SiteFooter({ site, edit = false }: SiteFooterProps) {
  const sortedSocialLinks = [...(site.socialLinks ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-950 px-6 pt-14 text-sm text-slate-300">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
        {/* Info */}
        <div>
          <p className="text-sm font-semibold text-blue-300">Church</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {site.meta.name}
          </h2>
          <p className="mt-4 leading-7 text-slate-400">
            {site.meta.description || "ここに説明文が入ります。"}
          </p>

          {sortedSocialLinks.length > 0 && (
            <div className="mt-5 flex items-center gap-2">
              {sortedSocialLinks.map((item: SiteSocialLink) => (
                <LinkButtonFooter key={item.id} item={item} />
              ))}
              <ShareButtonFooter />
            </div>
          )}
        </div>

        {/* Business Hours */}
        <div>
          <h3 className="font-semibold text-white">営業時間</h3>
          <ul className="mt-4 space-y-2 text-slate-400">
            <li>月曜日〜金曜日：9:00 - 18:00</li>
            <li>土曜日：10:00 - 17:00</li>
            <li>日曜日：定休日</li>
          </ul>
        </div>

        {/* Sitemap (SiteNavigation) */}
        <div>
          <h3 className="font-semibold text-white">サイトマップ</h3>
          <ul className="mt-4 space-y-2">
            {site.navigation?.menu?.map((m) => (
              <li key={m.label}>
                <a href={m.href ?? "#"} className="transition hover:text-white">
                  {m.label}
                </a>
                {m.children && m.children.length > 0 && (
                  <ul className="mt-2 space-y-2 border-l border-white/10 pl-3 text-slate-400">
                    {m.children.map((c) => (
                      <li key={c.label}>
                        <a
                          href={c.href ?? "#"}
                          className="transition hover:text-white"
                        >
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white">お問い合わせ</h3>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <FaLocationDot className="mt-1 shrink-0 text-blue-300" />
              <span className="leading-6">
                {site.meta.postalCode && (
                  <>
                    〒{site.meta.postalCode}
                    <br />
                  </>
                )}
                {site.meta.address}
                {site.meta.bldg && (
                  <>
                    <br />
                    {site.meta.bldg}
                  </>
                )}
              </span>
            </li>
            {site.meta.tel && (
              <li>
                <a
                  href={`tel:${site.meta.tel}`}
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <FaPhone className="shrink-0 text-blue-300" />
                  <span>{site.meta.tel}</span>
                </a>
              </li>
            )}
            {site.meta.email && (
              <li>
                <a
                  href={`mailto:${site.meta.email}`}
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <FaEnvelope className="shrink-0 text-blue-300" />
                  <span>{site.meta.email}</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-3 border-t border-white/10 py-6 text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.meta.name}. All rights
          reserved.
        </p>
        <div className="flex gap-4">
          <a href="/privacy" className="transition hover:text-white">
            プライバシーポリシー
          </a>
          <a href="/terms" className="transition hover:text-white">
            利用規約
          </a>
        </div>
      </div>

      {/* Control Panel */}
      {edit && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-4 shadow-lg z-50">
          <button className="w-1/2 py-2 border rounded text-slate-700 hover:bg-slate-50 transition">
            プレビュー
          </button>
          <button className="w-1/2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium">
            保存
          </button>
        </div>
      )}
    </footer>
  );
}
