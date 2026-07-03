"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types";
import { supabase } from "@/lib/supabase";

import { FaBars, FaXmark } from "react-icons/fa6";
import { NewsModal } from "@/components/news/news-modal";

type Props = {
  menu: MenuItem[];
  newsItems: NewsItem[];
};

export function HamburgerMenu(props: Props) {
  const { menu, newsItems } = props;
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* 🍔 トリガーとなる普通のハンバーガーボタン */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="メニューを開く"
        className="text-gray-600 p-2 text-xl hover:text-gray-900 transition-colors cursor-pointer"
      >
        <FaBars />
      </button>

      {/* 📱 メニュー本体（開いている時だけ表示） */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* 背景の黒透明 */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* 右側から出てくるグレーベースのメニューボード */}
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

            {/* 階層メニュー一覧 */}
            <nav className="flex flex-col gap-5 overflow-y-auto pr-1">
              {menu.map((m: MenuItem, i: number) => {
                const hasChildren = m.children && m.children.length > 0;

                // 🔔 パターン1: お知らせメニューの場合（ポップアップさせない！）
                if (m.type === "news") {
                  return (
                    <div
                      key={`${i}-${m.label}`}
                      className="flex flex-col gap-2"
                    >
                      {/* 💡 ポップアップを開くモーダルボタンに差し替え！ */}
                      <NewsModal newsItems={newsItems} label={m.label} />
                    </div>
                  );
                }

                // 🚪 パターン2: ログアウトボタンの場合
                if (m.type === "logout") {
                  return (
                    <div
                      key={`${i}-${m.label}`}
                      className="flex flex-col gap-2"
                    >
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm font-bold text-red-600 py-1 hover:text-red-700 text-left cursor-pointer"
                      >
                        {m.label}
                      </button>
                    </div>
                  );
                }

                // 🔗 パターン3: 通常のリンクや子メニューを持つ親
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
                            onClick={() => {
                              setIsOpen(false);
                              if (c.type === "logout") {
                                handleLogout();
                              }
                            }}
                            className={`block py-1.5 text-sm transition-colors ${
                              c.type === "logout"
                                ? "text-red-600 font-medium hover:text-red-700"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
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
