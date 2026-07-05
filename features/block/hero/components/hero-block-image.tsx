// src/components/features/block/hero-block-single-image.tsx
"use client";

import Image from "next/image";
import ImageUploader from "@/components/media/image-uploader";
import { HeroBlockData } from "@/features/block";
import { useImagePicker } from "@/components/image-picker";

type Props = HeroBlockData & {
  edit?: boolean;
  onUpdateBlock: (updatedData: HeroBlockData) => void;
};

export default function HeroBlockSingleImage(props: Props) {
  const data = props;
  const { edit = false, onUpdateBlock } = props;
  const { title, message, images = [] } = data;
  const image = images?.[0];

  const { openPicker } = useImagePicker();

  // 🖼️ 画像変更用
  const handleImageEditClick = () => {
    openPicker((newUrl: string) => {
      const updatedImages = [{ url: newUrl, alt: title || "Hero Image" }];
      onUpdateBlock({
        ...data,
        images: updatedImages,
      });
    });
  };

  // ✍️ タイトル変更用
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateBlock({
      ...data,
      title: e.target.value, 
    });
  };

  return (
    <div className="relative min-h-[86svh] overflow-hidden bg-slate-900 px-6 text-white">
      {/* カメラボタン */}
      {edit && (
        <div className="absolute right-4 top-4 z-20">
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
        
        {/* 💡 タイトル部分を修正 */}
        <div className="w-full max-w-4xl mt-4">
          {edit ? (
            // 編集モードの時は、入力用のインプットを表示（見た目は文字っぽくスタイリング）
            <input
              type="text"
              value={title || ""}
              onChange={handleTitleChange}
              className="w-full bg-transparent border-b border-dashed border-white/50 text-center text-4xl font-bold leading-tight md:text-6xl focus:outline-none focus:border-white py-2"
              placeholder="タイトルを入力"
            />
          ) : (
            // 通常モードの時は、そのまま h1 として表示
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              {title}
            </h1>
          )}
        </div>

        {message && (
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}