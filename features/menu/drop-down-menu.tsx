"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 💡 client component の安全な遷移のため useRouter に変更
import Image from "next/image";

import { MenuItem } from "@/types/site-menu";
import { NewsItem } from "@/features/block/news/types"; // 💡 お知らせの型をインポート
import { supabase } from "@/lib/supabase";

import { FaChevronDown } from "react-icons/fa6";
import { NewsModal } from "@/components/news/news-modal"; 

type Props = {
  menu: MenuItem[];
  newsItems: NewsItem[]; // 💡 引数を関数から「お知らせデータそのもの」に変更
};

export function DropDownMenu(props: Props) {
  const { menu, newsItems } = props;
  const menuRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const router = useRouter();

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div ref={menuRef} className="flex h-full items-center gap-2">
      {menu.map((m: MenuItem, i: number) => {
        const hasChildren = m.children && m.children.length > 0;
        const isOpen = openIndex === i;

        // 🔔 パターン1: お知らせメニューの場合
        if (m.type === "news") {
          return (
            <div key={`${i}-${m.label}`} className="relative flex h-full items-center">
              {/* 💡 ボタンごと、先ほど作った NewsPopover に差し替えます */}
              {/* NewsPopover 側のスタイルが浮かないよう、必要であれば NewsPopover 側のデザインと微調整してください */}
              <NewsModal newsItems={newsItems} />
            </div>
          );
        }

        // 🔗 パターン2: 通常のドロップダウンメニュー
        return (
          <div key={`${i}-${m.label}`} className="relative flex h-full items-center">
            <button
              onClick={() => toggle(i)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer ${
                isOpen
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {m.icon && (
                <Image
                  src={m.icon || "/default-icon.png"}
                  alt={m.label}
                  width={22}
                  height={22}
                  className="rounded-full object-cover ring-1 ring-gray-200"
                />
              )}
              <span>{m.label}</span>
              
              {hasChildren && (
                <FaChevronDown 
                  className={`text-[10px] text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-blue-600" : ""
                  }`} 
                />
              )}
            </button>

            {hasChildren && isOpen && (
              <div className="absolute right-0 top-full z-50 mt-0 w-[200px] rounded-lg border border-gray-100 bg-white p-1.5 shadow-md animate-in fade-in slide-in-from-top-1 duration-100">
                {m.children!.map((c: MenuItem, j: number) => (
                  <a
                    key={`${m.label}-${i}-${c.label}-${j}`}
                    href={c.href}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      c.type === "logout"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={(e) => {
                      if (c.type === "logout") {
                        e.preventDefault();
                        handleLogout();
                      }
                    }}
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}