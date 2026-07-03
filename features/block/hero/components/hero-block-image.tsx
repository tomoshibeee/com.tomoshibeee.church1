// src/components/features/block/hero-block-single-image.tsx
"use client";

import Image from "next/image";

import ImageUploader from "@/components/media/image-uploader";
import { HeroBlockData } from "@/features/block";
// 💡 1. 共通の画像ピッカーフックをインポート
import { useImagePicker } from "@/components/image-picker";

type Props = HeroBlockData & {
  edit?: boolean;
  onUpdateBlock: (updatedData: HeroBlockData) => void; // 💡 2. 親へ更新を伝える関数を追加
};

export default function HeroBlockSingleImage(props: Props) {
  const data = props;
  // 💡 3. 古い onOpenImageUploader は受け取らず、onUpdateBlock を受け取る
  const { edit = false, onUpdateBlock } = props;
  const { title, message, images = [] } = data;
  const image = images?.[0];

  // 💡 4. 共通のリモコン（openPicker）を取り出す
  const { openPicker } = useImagePicker();

  // 💡 5. カメラボタンが押された時の「1枚画像を差し替える」処理を定義
  const handleImageEditClick = () => {
    openPicker((newUrl: string) => {
      // 💡 1枚画像ブロックなので、0番目の要素を新しいURLに差し替えた配列を作る
      const updatedImages = [{ url: newUrl, alt: title || "Hero Image" }];

      // 親コンポーネントへ更新データを届ける
      onUpdateBlock({
        ...data,
        images: updatedImages,
      });
    });
  };

  return (
    <div className="relative min-h-[86svh] overflow-hidden bg-slate-900 px-6 text-white">
      {/* カメラボタン */}
      {edit && (
        <div className="absolute right-4 top-4 z-20">
          {/* 💡 6. 新しいハンドル関数を渡す */}
          <ImageUploader
            data={data}
            onOpenImageUploader={handleImageEditClick}
          />
        </div>
      )}

      {image && (
        <Image
          src={image.url}
          alt={image.alt || "Hero Image"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
      <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-5xl flex-col items-center justify-center pb-28 pt-24 text-center">
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          {title}
        </h1>
        {message && (
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
