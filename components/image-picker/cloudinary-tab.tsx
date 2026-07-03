"use client";

import { useRef, useState } from "react";
import { FaCloudArrowUp, FaSpinner } from "react-icons/fa6"; // アイコンを追加
import { uploadImage } from "@/lib/cloudinary/upload-image";

type Props = {
  onSelect: (url: string) => void;
};

export function CloudinaryTab(props: Props) {
  const { onSelect } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false); // アップロード中の状態管理

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      onSelect(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  };

  // 点線のエリアをクリックしたときに、隠されているinput要素を発火させる
  const handleAreaClick = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {/* 隠しインプット */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*" // 画像ファイルのみに制限
        onChange={handleChange}
        className="hidden"
      />

      {/* 
        デザイン変更したアップロードエリア 
        参考デザインの「ホバー時のシャドウ・光沢感」や「ブルーの配色」を応用
      */}
      <div
        onClick={handleAreaClick}
        className={`group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition cursor-pointer
          ${
            isUploading
              ? "border-blue-300 bg-blue-50/30 cursor-not-allowed"
              : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-sm"
          }`}
      >
        {isUploading ? (
          // アップロード中のアニメーション表示
          <div className="flex flex-col items-center gap-3">
            <FaSpinner className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-blue-600">
              画像をアップロード中...
            </p>
          </div>
        ) : (
          // 通常時の表示
          <div className="flex flex-col items-center">
            {/* アイコン（参考デザインのアイコン枠のようなスマートな配置） */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition duration-200">
              <FaCloudArrowUp className="text-xl" />
            </div>

            <h4 className="text-base font-bold text-gray-900 mb-1">
              クリックして画像を選択
            </h4>

            <p className="text-xs text-gray-500 leading-5">
              または、ここにファイルをドラッグ＆ドロップ
            </p>
            <p className="mt-2 text-2xs text-gray-400">
              対応形式: PNG, JPG, GIF, WebP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
