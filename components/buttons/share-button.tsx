"use client";

import { useState } from "react";
// 💡 アイコンをさらに洗練された、AppleやSafariでおなじみの「箱から矢印が飛び出す」タイプに変更
import { FaUpRightFromSquare, FaLine, FaXTwitter, FaCopy, FaCheck, FaXmark } from "react-icons/fa6";

type Props = {
  className?: string;
};

export function ShareButton({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const SIZE = 18;

  const handleShare = (e: React.MouseEvent, type: "line" | "twitter" | "copy") => {
    e.preventDefault();
    e.stopPropagation();

    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const currentTitle = typeof document !== "undefined" ? document.title : "";

    if (type === "line") {
      const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`;
      window.open(lineUrl, "_blank", "noreferrer,noopener");
    }

    if (type === "twitter") {
      const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(currentTitle)}`;
      window.open(twitterUrl, "_blank", "noreferrer,noopener");
    }

    if (type === "copy") {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }

    if (type !== "copy") setIsOpen(false);
  };

  return (
    <>
      {/* 🔗 シェアボタン本体 */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`${className} cursor-pointer`}
        aria-label="このページを共有する"
      >
        <FaUpRightFromSquare size={SIZE} />
      </button>

      {/* 📋 画面中央シェアモーダル（開いている時だけ表示） */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center md:items-center">
          
          {/* 🌫️ 背景の黒透明（ブラーをかけて高級感を演出） */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* 📦 モーダル本体（スマホでは下からスライド、PCでは中央にフワッと表示） */}
          <div className="relative z-10 w-full rounded-t-2xl bg-white p-6 shadow-2xl transition-all duration-300 md:max-w-xs md:rounded-2xl
            animate-in fade-in slide-in-from-bottom md:zoom-in-95"
          >
            {/* 上部のタイトルバー */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-800">ページを共有する</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors"
              >
                <FaXmark size={18} />
              </button>
            </div>

            {/* シェアボタンのリスト */}
            <div className="flex flex-col gap-2">
              
              {/* LINE */}
              <button
                type="button"
                onClick={(e) => handleShare(e, "line")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 cursor-pointer"
              >
                <FaLine size={20} className="text-[#06C755]" />
                <span>LINEで送る</span>
              </button>

              {/* X (Twitter) */}
              <button
                type="button"
                onClick={(e) => handleShare(e, "twitter")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-slate-900 hover:text-white hover:border-slate-900 cursor-pointer"
              >
                <FaXTwitter size={20} />
                <span>Xで共有</span>
              </button>

              {/* リンクコピー */}
              <button
                type="button"
                onClick={(e) => handleShare(e, "copy")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-pointer"
              >
                {copied ? (
                  <FaCheck size={20} className="text-emerald-500" />
                ) : (
                  <FaCopy size={20} className="text-gray-500 group-hover:text-blue-600" />
                )}
                <span>{copied ? "コピーしました！" : "リンクをコピー"}</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 💡 呼び出し用のラッパー。isFooterの判定がいらなくなったため非常にシンプルになりました！
export function ShareButtonHeader() {
  return (
    <ShareButton
      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-slate-100 hover:text-gray-900"
    />
  );
}

export function ShareButtonFooter() {
  return (
    <ShareButton
      className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-gray-200 transition hover:bg-gray-600 hover:text-white"
    />
  );
}