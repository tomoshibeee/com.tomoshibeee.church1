"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaXmark } from "react-icons/fa6"; // NewsModalとアイコンも統一
import { MetaData } from "@/types/site-meta";

interface MetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MetaData;
  onSave: (updatedMeta: MetaData) => void;
}

export function MetaModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: MetaModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MetaData>({
    defaultValues: initialData,
  });

  // モーダルが開いたときに初期値を最新にする
  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: MetaData) => {
    try {
      await onSave(data);
      onClose(); // 保存が成功したら閉じる
    } catch (error) {
      console.error("Failed to save meta data:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center md:items-center">
      {/* 🌫️ 背景の黒透明（ブラーをかけて高級感を演出） */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 📦 モーダル本体（スマホでは下からスライド、PCでは中央に表示） */}
      <div
        className="relative z-10 w-full rounded-t-2xl bg-white p-6 shadow-2xl transition-all duration-300 md:max-w-lg md:rounded-2xl max-h-[85vh] flex flex-col
        animate-in fade-in slide-in-from-bottom md:zoom-in-95"
      >
        {/* 上部のタイトルバー */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0 border-b border-slate-50 pb-2">
          <h3 className="text-sm font-bold text-gray-800">
            サイト基本情報の編集
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <FaXmark size={18} />
          </button>
        </div>

        {/* フォーム入力エリア（スクロール対応エリア） */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto space-y-4 pr-1 pb-4 flex-1 scrollbar-thin"
        >
          {/* サイト名・店舗名 (name) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              サイト名・店舗名
            </label>
            <input
              type="text"
              {...register("name", { required: "サイト名は必須です" })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 電話番号 (tel) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              電話番号
            </label>
            <input
              type="tel"
              {...register("tel")}
              placeholder="054-111-1111"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* メールアドレス (email) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="info@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 郵便番号 (postalCode) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              郵便番号
            </label>
            <input
              type="text"
              {...register("postalCode")}
              placeholder="421-1111"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 住所 (address) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              住所
            </label>
            <input
              type="text"
              {...register("address")}
              placeholder="静岡県静岡市..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 建物名・部屋番号 (bldg) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              建物名・部屋番号
            </label>
            <input
              type="text"
              {...register("bldg")}
              placeholder="ビル名、マンション名など"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* アクセス (access) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              アクセス
            </label>
            <input
              type="text"
              {...register("access")}
              placeholder="JR静岡駅から徒歩15分"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* サイトの説明文 (description) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              サイトの説明文（紹介文）
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="サイトの紹介文を入力してください。"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 💾 アクションボタンエリア（スクロールしても最下部に固定されるようにform内に配置） */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {isSubmitting ? "保存中..." : "変更を保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
