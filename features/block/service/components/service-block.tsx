"use client";

import { ServiceBlockData } from "@/features/block";
import { SiteMode } from "@/types/site";
import {
  FaArrowRight,
  FaClock,
  FaLocationDot,
  FaRegCalendarCheck,
} from "react-icons/fa6";

const getGridCols = (count: number) => {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3";
};

// 💡 Propsに onUpdateBlock を追加
type Props = ServiceBlockData & {
  mode?: SiteMode;
  onUpdateBlock?: (updatedData: ServiceBlockData) => void;
};

export default function ServiceBlock(props: Props) {
  const { items = [], mode = "view", onUpdateBlock } = props;
  const isEdit = mode === "edit";
  const gridCols = getGridCols(items.length);

  // ✍️ 特定のアイテムの特定のフィールドを更新するハンドラー
  const handleItemChange = (
    id: string,
    field: keyof (typeof items)[number],
    value: string,
  ) => {
    if (!onUpdateBlock) return;

    // 該当する id のアイテムだけを書き換えた新しい配列を作成
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );

    // 親コンポーネントへ更新データを通知
    onUpdateBlock({
      ...props, // 既存の他のプロパティ（もしあれば）を維持
      items: updatedItems,
    });
  };

  return (
    <div className="bg-white px-6 py-14 text-gray-800">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Service</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              サービスのご案内
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-gray-600">
            はじめての方も安心して参加できる、教会の主な礼拝と集会です。
          </p>
        </div>

        <div className={`grid ${gridCols} gap-5`}>
          {items.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col rounded-lg bg-slate-50 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-blue-600 text-white">
                <FaRegCalendarCheck />
              </div>

              {/* 💡 タイトル部分の編集切り替え */}
              <div className="w-full">
                {isEdit ? (
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) =>
                      handleItemChange(item.id, "title", e.target.value)
                    }
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-lg font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="案内名（例：日曜礼拝）"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {/* 💡 時間部分の編集切り替え */}
                <div className="flex items-center gap-2">
                  <FaClock className="shrink-0 text-blue-500" />
                  {isEdit ? (
                    <input
                      type="text"
                      value={item.time || ""}
                      onChange={(e) =>
                        handleItemChange(item.id, "time", e.target.value)
                      }
                      className="w-full bg-white border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="日時（例：毎週日曜 10:30〜）"
                    />
                  ) : (
                    <span>{item.time}</span>
                  )}
                </div>

                {/* 💡 場所部分の編集切り替え */}
                <div className="flex items-center gap-2">
                  <FaLocationDot className="shrink-0 text-blue-500" />
                  {isEdit ? (
                    <input
                      type="text"
                      value={item.location || ""}
                      onChange={(e) =>
                        handleItemChange(item.id, "location", e.target.value)
                      }
                      className="w-full bg-white border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="場所（例：礼拝堂）"
                    />
                  ) : (
                    <span>{item.location}</span>
                  )}
                </div>
              </div>

              {/* 💡 コメント部分の編集切り替え（複数行入力できるよう textarea にしています） */}
              <div className="mt-5 flex-1 flex flex-col justify-between">
                {isEdit ? (
                  <textarea
                    value={item.comment || ""}
                    onChange={(e) =>
                      handleItemChange(item.id, "comment", e.target.value)
                    }
                    className="w-full h-24 bg-white border border-gray-300 rounded px-2 py-1 text-sm leading-7 text-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="説明文文を入力してください"
                  />
                ) : (
                  item.comment && (
                    <p className="text-sm leading-7 text-gray-600">
                      {item.comment}
                    </p>
                  )
                )}

                {/* 💡 リンク部分の表示（編集モード時は入力フィールドとの重複や誤クリック防止のため非表示にするか、もしくはそのまま表示） */}
                {!isEdit && item.link && (
                  <a
                    href={item.link}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    詳しく見る
                    <FaArrowRight className="text-xs" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
