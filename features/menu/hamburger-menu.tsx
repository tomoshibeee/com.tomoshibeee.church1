"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types";
import { FaBars, FaXmark } from "react-icons/fa6";
import { NewsModal } from "@/components/news/news-modal";

type Props = {
  menu: MenuItem[];
  newsItems: NewsItem[];
};

export function HamburgerMenu({ menu, newsItems }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🍔 トリガーボタン */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="メニューを開く"
        className="text-gray-600 p-2 text-xl hover:text-gray-900 transition-colors cursor-pointer"
      >
        <FaBars />
      </button>

      {/* 📱 ドロワーメニュー本体 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* 背景のオーバーレイ */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* 右側スライドインボード */}
          <div className="relative ml-auto flex h-full w-[280px] flex-col bg-slate-50 p-6 shadow-xl animate-in slide-in-from-right duration-200">
            {/* 閉じるボタン */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="メニューを閉じる"
                className="text-gray-500 p-2 text-xl hover:text-gray-900 transition-colors cursor-pointer"
              >
                <FaXmark />
              </button>
            </div>

            {/* メニュー一覧 */}
            <nav className="flex flex-col gap-5 overflow-y-auto pr-1">
              {menu.map((m: MenuItem, i: number) => {
                const hasChildren = m.children && m.children.length > 0;

                // 🔔 お知らせメニューの場合
                if (m.type === "news") {
                  return (
                    <div
                      key={`${i}-${m.label}`}
                      className="flex flex-col gap-2"
                    >
                      <NewsModal newsItems={newsItems} label={m.label} />
                    </div>
                  );
                }

                // 🔗 通常のリンクまたは階層メニュー
                return (
                  <div key={`${i}-${m.label}`} className="flex flex-col gap-2">
                    {m.href ? (
                      <Link
                        href={m.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-bold text-gray-800 py-1 hover:text-blue-600 transition-colors"
                      >
                        {m.label}
                      </Link>
                    ) : (
                      <div className="text-sm font-bold text-gray-800 py-1">
                        {m.label}
                      </div>
                    )}

                    {/* 第二階層（子メニュー） */}
                    {hasChildren && (
                      <div className="flex flex-col gap-1 border-l-2 border-slate-200 pl-3 ml-1">
                        {m.children!.map((c: MenuItem, j: number) => (
                          <Link
                            key={`${m.label}-${i}-${c.label}-${j}`}
                            href={c.href || "#"}
                            onClick={() => setIsOpen(false)}
                            className="block py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
