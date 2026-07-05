"use client";

import { FaArrowRight } from "react-icons/fa6";
import { CtaBlockData } from "@/features/block";

// 💡 共通のProps規格に準拠
type Props = CtaBlockData & {
  edit?: boolean;
  onUpdateBlock?: (updatedData: CtaBlockData) => void;
};

export default function CtaBlock(props: Props) {
  const data = props;
  const { buttons = [], edit = false, onUpdateBlock } = props;

  // ✍️ 特定のボタンのフィールド（label または href）を更新するハンドラー
  const handleButtonChange = (
    index: number,
    field: keyof typeof buttons[number],
    value: string
  ) => {
    if (!onUpdateBlock) return;

    // 指定されたインデックスのボタンだけを書き換えた新しい配列を作成
    const updatedButtons = buttons.map((btn, i) =>
      i === index ? { ...btn, [field]: value } : btn
    );

    // 親コンポーネントへ更新データを通知
    onUpdateBlock({
      ...data,
      buttons: updatedButtons,
    });
  };

  // 編集モードでなく、ボタンが0件の場合は非表示
  if (!edit && buttons.length === 0) return null;

  return (
    <div className="absolute bottom-10 left-1/2 z-20 w-full -translate-x-1/2 px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-stretch justify-center gap-3 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:rounded-full">
        {buttons.map((b, i) => {
          // 💡 編集モード時は a タグの代わりに div を使い、クリックによるページ遷移を防ぐ
          const Component = edit ? "div" : "a";
          const hrefProps = edit ? {} : { href: b.href };

          return (
            <Component
              key={`${b.href}-${i}`}
              {...hrefProps}
              className={`inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-semibold transition sm:min-w-44 sm:rounded-full relative ${
                i === 0
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-50 text-gray-800"
              } ${edit ? "" : i === 0 ? "hover:bg-blue-700" : "hover:bg-blue-50 hover:text-blue-700"}`}
            >
              {edit ? (
                // 🛠️ 編集モード：テキスト入力とリンク入力をコンパクトに配置
                <div className="flex w-full flex-col gap-1 text-xs">
                  <input
                    type="text"
                    value={b.label || ""}
                    onChange={(e) => handleButtonChange(i, "label", e.target.value)}
                    className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-center text-gray-900 font-semibold focus:outline-none focus:border-blue-500"
                    placeholder="ボタン文字"
                  />
                  <input
                    type="text"
                    value={b.href || ""}
                    onChange={(e) => handleButtonChange(i, "href", e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white px-1.5 py-0.25 text-center text-[10px] font-normal text-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="リンク先（例: #contact）"
                  />
                </div>
              ) : (
                // 👁️ 通常モード：いつものボタン表示
                <div className="flex items-center gap-2">
                  <span>{b.label}</span>
                  <FaArrowRight className="text-xs" />
                </div>
              )}
            </Component>
          );
        })}
      </div>
    </div>
  );
}