"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import ImageUploader from "@/components/media/image-uploader";
import { HeroBlockData } from "@/features/block";
import { useImagePicker } from "@/components/image-picker";
import { SiteMode } from "@/types/site";

type Props = HeroBlockData & {
  mode?: SiteMode;
  onUpdateBlock: (updatedData: HeroBlockData) => void;
};

export default function HeroBlockCarousel(props: Props) {
  const data = props;
  const { mode = "view", onUpdateBlock } = props;
  const isEdit = mode === "edit";
  const INTERVAL = 3000;
  const DURATION = 700;

  const { title, message, images = [] } = data;
  const extended = images.length > 0 ? [...images, images[0]] : [];

  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);

  // 💡 4. 共通のリモコン（openPicker）を取り出す
  const picker = useImagePicker();
  const openPicker = picker?.openPicker;

  // 🖼️ 5. カメラボタンが押された時の「既存の配列に画像を追加する」処理を定義
  const handleImageEditClick = () => {
    if (!isEdit || !openPicker || !onUpdateBlock) return;

    openPicker((newUrl: string) => {
      // 既存のimagesの末尾に、新しく選んだ画像のオブジェクトを追加した配列を作る
      const updatedImages = [
        ...images,
        { url: newUrl, alt: title || "Slide Image" },
      ];

      // 親コンポーネント（EditPageContainerなど）へ更新データを届ける
      onUpdateBlock({
        ...data,
        images: updatedImages,
      });
    });
  };

  // ✍️ タイトル変更用（SingleImageの実装を移植）
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateBlock({
      ...data,
      title: e.target.value,
    });
  };

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;

    if (index === images.length) {
      resetTimer = setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, DURATION);

      transitionTimer = setTimeout(() => {
        setTransition(true);
      }, DURATION + 50);
    }

    return () => {
      if (resetTimer) clearTimeout(resetTimer);
      if (transitionTimer) clearTimeout(transitionTimer);
    };
  }, [index, images.length]);

  // ----------------------------------------------------
  // パターンA: 画像が1枚もない場合の初期表示（Welcome表示）
  // ----------------------------------------------------
  if (images.length === 0) {
    return (
      <div className="relative flex min-h-[86svh] items-center justify-center bg-slate-900 px-6 text-center text-white">
        {/* 💡 画像がないときでも編集モードならカメラボタンを出す */}
        {isEdit && (
          <div className="absolute right-4 top-4 z-20">
            <ImageUploader
              data={data}
              onOpenImageUploader={handleImageEditClick}
            />
          </div>
        )}
        <div className="w-full max-w-4xl">
          <p className="text-sm font-semibold text-blue-100">Welcome</p>

          {/* 💡 タイトル編集・表示エリア */}
          <div className="mt-4">
            {isEdit ? (
              <input
                type="text"
                value={title || ""}
                onChange={handleTitleChange}
                className="w-full bg-transparent border-b border-dashed border-white/50 text-center text-4xl font-bold leading-tight md:text-6xl focus:outline-none focus:border-white py-2"
                placeholder="タイトルを入力"
              />
            ) : (
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                {title}
              </h1>
            )}
          </div>

          {message && (
            <p className="mt-5 text-base leading-8 text-white/85 md:text-lg">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // パターンB: 画像がある場合（通常のカルーセル表示）
  // ----------------------------------------------------
  return (
    <div className="relative min-h-[86svh] overflow-hidden bg-slate-900 text-white">
      {/* カメラボタン */}
      {isEdit && (
        <div className="absolute right-4 top-4 z-20">
          {/* 💡 6. 新しいハンドル関数を繋ぎこむ */}
          <ImageUploader
            data={data}
            onOpenImageUploader={handleImageEditClick}
          />
        </div>
      )}

      {/* スライダー本体 */}
      <div
        className={`flex min-h-[86svh] ${
          transition ? "transition-transform duration-700" : ""
        }`}
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {extended.map((img, i) => (
          <div key={`${img.url}-${i}`} className="relative min-w-full">
            <Image
              src={img.url}
              alt={img.alt ?? "Slide Image"}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* オーバーレイ（背景を暗くして文字を見やすくするレイヤー） */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

      {/* コンテンツエリア */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pb-28 pt-24 text-center">
        <div className="w-full max-w-4xl">
          {/* 💡 タイトル編集・表示エリア */}
          <div className="mt-4">
            {isEdit ? (
              <input
                type="text"
                value={title || ""}
                onChange={handleTitleChange}
                className="w-full bg-transparent border-b border-dashed border-white/50 text-center text-4xl font-bold leading-tight md:text-6xl focus:outline-none focus:border-white py-2"
                placeholder="タイトルを入力"
              />
            ) : (
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                {title}
              </h1>
            )}
          </div>

          {message && (
            <p className="mt-5 text-base leading-8 text-white/85 md:text-lg">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* インジケーター（ドット） */}
      <div className="absolute bottom-28 z-10 flex w-full justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}枚目の画像を表示`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index % images.length === i ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
