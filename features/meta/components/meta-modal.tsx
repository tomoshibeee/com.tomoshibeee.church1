"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MetaData } from "@/types/site-meta";

interface MetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MetaData;
  onSave: (updatedMeta: MetaData) => void;
}

export function MetaModal({ isOpen, onClose, initialData, onSave }: MetaModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
        {/* ヘッダー */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">サイト基本情報の編集</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* サイト名・店舗名 (name) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">サイト名・店舗名</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
            <input
              type="tel"
              {...register("tel")}
              placeholder="054-111-1111"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* メールアドレス (email) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              {...register("email")}
              placeholder="info@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 郵便番号 (postalCode) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
            <input
              type="text"
              {...register("postalCode")}
              placeholder="421-1111"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 住所 (address) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
            <input
              type="text"
              {...register("address")}
              placeholder="静岡県静岡市..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 建物名・部屋番号 (bldg) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">建物名・部屋番号</label>
            <input
              type="text"
              {...register("bldg")}
              placeholder="ビル名、マンション名など"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* アクセス (access) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">アクセス</label>
            <input
              type="text"
              {...register("access")}
              placeholder="JR静岡駅から徒歩15分"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* サイトの説明文 (description) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">サイトの説明文（紹介文）</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="サイトの紹介文を入力してください。"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-2 border-t pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? "保存中..." : "変更を保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}