"use client";

import { useState } from "react";
import { FaBell, FaXmark } from "react-icons/fa6";
import { NewsItem } from "@/features/block/news/types";
import { NewsCard } from "@/components/news/news-card";

type Props = {
  newsItems: NewsItem[];
  /** トリガーとなるボタンのテキスト（ハンバーガー内なら「お知らせ」、ヘッダーならアイコンのみなど調整用） */
  label?: string;
  /** 外側からボタンのスタイルを上書きしたい場合 */
  className?: string;
};

export function NewsModal({ newsItems, label = "お知らせ", className }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🔔 お知らせトリガーボタン */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "flex items-center gap-2 text-sm font-bold text-gray-800 py-1 hover:text-blue-600 transition-colors w-full text-left cursor-pointer"
        }
      >
        <div className="flex items-center gap-2">
          <FaBell
            className={newsItems.length > 0 ? "text-blue-600" : "text-gray-500"}
            size={14}
          />
          <span>{label}</span>
          {newsItems.length > 0 && (
            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
              {newsItems.length}
            </span>
          )}
        </div>
      </button>

      {/* 📋 画面全体お知らせモーダル（開いている時だけ表示） */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center md:items-center">
          {/* 🌫️ 背景の黒透明（ブラーをかけて高級感を演出） */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* 📦 モーダル本体（スマホでは下からスライド、PCでは中央にフワッと表示） */}
          <div
            className="relative z-10 w-full rounded-t-2xl bg-white p-6 shadow-2xl transition-all duration-300 md:max-w-md md:rounded-2xl max-h-[80vh] flex flex-col
            animate-in fade-in slide-in-from-bottom md:zoom-in-95"
          >
            {/* 上部のタイトルバー */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0 border-b border-slate-50 pb-2">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <span>お知らせ一覧</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                  {newsItems.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <FaXmark size={18} />
              </button>
            </div>

            {/* お知らせリスト（スクロール対応エリア） */}
            <div className="overflow-y-auto space-y-3 pr-1 pb-4 flex-1 scrollbar-thin">
              {newsItems.length === 0 ? (
                <p className="py-12 text-center text-xs text-gray-400">
                  現在、新しいお知らせはありません。
                </p>
              ) : (
                newsItems.map((item, i) => (
                  <NewsCard key={item.id ?? `modal_news_${i}`} {...item} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
