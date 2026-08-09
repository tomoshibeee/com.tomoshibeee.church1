// src/components/editor/AddBlockModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { MasterBlock } from "@/models/master-block";
import { getMasterBlocks } from "@/services/master-block-service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (masterBlock: MasterBlock) => void;
};

// カテゴリー表示用のラベルマップ
const CATEGORY_LABELS: Record<string, string> = {
  main: "メイン・導線",
  content: "コンテンツ・紹介",
  feature: "お知らせ・機能",
  contact: "案内・お問い合わせ",
  general: "その他",
};

export const BlockModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectBlock,
}) => {
  const [masterBlocks, setMasterBlocks] = useState<MasterBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!isOpen) return;

    const fetchBlocks = async () => {
      setLoading(true);
      try {
        const blocks = await getMasterBlocks();
        setMasterBlocks(blocks);
      } catch (error) {
        console.error("Failed to load master blocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [isOpen]);

  if (!isOpen) return null;

  // カテゴリー一覧の抽出
  const categories = Array.from(
    new Set(masterBlocks.map((b) => b.category || "general"))
  );

  // フィルタリング処理
  const filteredBlocks =
    selectedCategory === "all"
      ? masterBlocks
      : masterBlocks.filter((b) => (b.category || "general") === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              ブロックを追加
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ページに配置したいブロックを選択してください
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* カテゴリーフィルター（タブ） */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 px-6 py-3 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* ブロックリスト */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-xs text-slate-400">
              <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
              マスターブロックを読み込み中...
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              該当するブロックがありません
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredBlocks.map((block) => (
                <div
                  key={block.type}
                  onClick={() => {
                    onSelectBlock(block);
                    onClose();
                  }}
                  className="group flex flex-col justify-between rounded-lg border border-slate-200 p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors">
                        {block.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        {block.type}
                      </span>
                    </div>
                    {block.description && (
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {block.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-end text-xs font-medium text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>+ 追加する</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};