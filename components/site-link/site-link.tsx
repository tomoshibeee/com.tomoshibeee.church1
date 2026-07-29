import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { SiteMode } from "@/types/site";
import { SiteMeta } from "@/models/site-meta";

type Props = {
  meta: SiteMeta;
  mode?: SiteMode;
};

export function SiteLink(props: Props) {
  const { meta, mode } = props;
  const { site_id, name, slug, background_image, avatar } = meta;

  const href =
    mode === "edit"
      ? `/dashboard/${site_id}`
      : mode === "preview"
        ? `/dashboard/${site_id}/preview`
        : `/p/${slug}`;

  const siteImage =
    background_image && background_image.trim() !== ""
      ? background_image
      : "https://picsum.photos/1200/600";

  const siteAvatar =
    avatar && avatar.trim() !== "" ? avatar : "https://picsum.photos/200/200";

  return (
    <Link
      href={href}
      // 全体の形状：mode="edit"ならモバイルもPCも横長(flex-row)。mode="view"ならMARKIS風に縦長カード(flex-col)
      className={`relative flex rounded-xl bg-white shadow-sm border border-gray-100 transition duration-300 hover:shadow-lg hover:-translate-y-1 group w-full ${
        mode === "edit" ? "flex-row h-[160px]" : "flex-col h-[320px]"
      }`}
    >
      {/* 📸 1. 画像エリア */}
      <div
        className={`relative bg-slate-100 shrink-0 overflow-hidden ${
          mode === "edit"
            ? "h-full w-1/3 sm:w-2/5 rounded-l-xl" // mode="edit": 左側が画像
            : "h-1/2 w-full rounded-t-xl" // mode="view": 上半分が画像
        }`}
      >
        <Image
          src={siteImage}
          alt={`${name}のカバー画像`}
          fill
          sizes="(max-w-768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ⚪️ 2. アバター（背景とタイトルの境界線上に配置） */}
      <div
        className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 ${
          mode === "edit"
            ? "top-1/2 left-[33.333%] sm:left-[40%]" // mode="edit": 左側画像の右端（縦の境界線）
            : "top-1/2 left-1/2" // mode="view": 上半分画像の真下（横の境界線）
        }`}
      >
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 rounded-full border-4 border-white bg-white shadow-md overflow-hidden transition duration-300 group-hover:scale-110">
          <Image
            src={siteAvatar}
            alt={`${name}のアイコン`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      </div>

      {/* 📝 3. サイト名と情報エリア */}
      <div
        className={`flex flex-1 p-5 text-center justify-between items-center bg-white z-10 border-gray-100 ${
          mode === "edit"
            ? "flex-row border-l pl-14 sm:pl-16 md:pl-20 rounded-r-xl" // mode="edit": 右側にテキスト(アバター避けの左余白)
            : "flex-row border-t pt-9 rounded-b-xl" // mode="view": 下半分にテキスト(アバター避けの上余白)
        }`}
      >
        {/* サイト名 */}
        <div className="space-y-1 text-left">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {name}
          </h3>
        </div>

        {/* 右側のボタンエリア */}
        <div className="flex justify-center items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 group-hover:text-blue-700 shrink-0">
          <span>
            {mode === "edit"
              ? "編集する"
              : mode === "preview"
                ? "プレビュー"
                : "サイトを見る"}
          </span>
          <FaArrowRight className="text-xs transition transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
