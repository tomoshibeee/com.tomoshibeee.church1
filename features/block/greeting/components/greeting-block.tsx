"use client";

import Image from "next/image";
import { FaQuoteLeft, FaCamera } from "react-icons/fa6";

import { GreetingBlockData } from "@/features/block";
import { useImagePicker } from "@/components/image-picker";

type Props = GreetingBlockData & {
  edit?: boolean;
  onUpdateBlock?: (updatedData: GreetingBlockData) => void;
};

export default function GreetingBlock(props: Props) {
  const data = props;
  const { edit = false, onUpdateBlock } = props;

  const picker = useImagePicker();
  const openPicker = picker?.openPicker;

  // ✍️ テキストフィールドを更新する共通ハンドラー
  const handleChange = (field: keyof GreetingBlockData, value: string) => {
    if (!edit || !onUpdateBlock) return;
    onUpdateBlock?.({
      ...data,
      [field]: value,
    });
  };

  // 🖼️ 画像変更用のハンドラー
  const handleImageEditClick = () => {
    if (!openPicker || !onUpdateBlock) {
      console.warn("Picker or onUpdateBlock is not available");
      return;
    }

    openPicker((newUrl: string) => {
      onUpdateBlock({
        ...data,
        image: newUrl,
      });
    });
  };

  if (!edit && !data.name?.trim()) return null;

  return (
    <div className="bg-white px-6 py-14 text-gray-800">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        {/* 左側：プロフィールカードエリア */}
        <div className="rounded-lg bg-slate-50 p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* 📸 アバター画像コンテナ（edit時は常時マスクを表示） */}
            <div className="relative h-36 w-36 overflow-hidden rounded-full ring-4 ring-white bg-gray-200">
              {data.image && (
                <Image
                  src={data.image}
                  alt={data.name || "プロフィール画像"}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              )}

              {/* 📸 編集モード時：常に画像の上に重ねるカメラボタン */}
              {edit && (
                <button
                  type="button"
                  onClick={handleImageEditClick}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white transition hover:bg-black/50 cursor-pointer"
                  aria-label="プロフィール画像を変更"
                >
                  <FaCamera className="text-xl" />
                  <span className="mt-1 text-[10px] font-medium">変更</span>
                </button>
              )}
            </div>

            <div className="mt-5 w-full space-y-2">
              {/* お名前の編集切り替え */}
              {edit ? (
                <input
                  type="text"
                  value={data.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-1 text-center text-xl font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="お名前"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
              )}

              {/* 肩書の編集切り替え */}
              {edit ? (
                <input
                  type="text"
                  value={data.role || ""}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-0.5 text-center text-sm font-medium text-blue-600 focus:outline-none focus:border-blue-500"
                  placeholder="役職・肩書"
                />
              ) : (
                data.role && (
                  <p className="text-sm font-medium text-blue-600">
                    {data.role}
                  </p>
                )
              )}
            </div>

            {/* プロフィール・略歴の編集切り替え */}
            <div className="mt-4 w-full">
              {edit ? (
                <textarea
                  value={data.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="w-full h-24 bg-white border border-gray-300 rounded px-2 py-1 text-sm leading-7 text-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="略歴・プロフィールを入力してください"
                />
              ) : (
                data.bio && (
                  <p className="text-sm leading-7 text-gray-600">{data.bio}</p>
                )
              )}
            </div>
          </div>
        </div>

        {/* 右側：メインメッセージエリア */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">Greeting</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {data.role ? `${data.role}からの` : ""}ごあいさつ
            </h2>
          </div>

          {/* ごあいさつ文の編集切り替え */}
          <div className="w-full">
            {edit ? (
              <div className="relative rounded-lg bg-slate-50 p-6 shadow-sm">
                <FaQuoteLeft className="mb-4 text-2xl text-blue-500" />
                <textarea
                  value={data.message || ""}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full h-32 bg-white border border-gray-300 rounded px-3 py-2 text-sm leading-8 text-gray-700 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="メッセージ本文を入力してください"
                />
              </div>
            ) : (
              data.message && (
                <blockquote className="relative rounded-lg bg-slate-50 p-6 text-gray-700 shadow-sm">
                  <FaQuoteLeft className="mb-4 text-2xl text-blue-500" />
                  <p className="leading-8">{data.message}</p>
                </blockquote>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
