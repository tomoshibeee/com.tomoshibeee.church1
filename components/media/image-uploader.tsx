import { HeroBlockData } from "@/features/block";
import { FaCamera } from "react-icons/fa6";

type Props = {
  data: HeroBlockData;
  onOpenImageUploader: () => void;
};

export default function ImageUploader(props: Props) {
  const { data, onOpenImageUploader } = props;

  return (
    <button
      onClick={onOpenImageUploader}
      className="group absolute right-4 top-4 z-20 flex h-10 items-center justify-center rounded-full bg-black/60 px-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:pr-4"
      aria-label="画像を変更"
    >
      {/* 標準的なカメラアイコン、または FaImage に変更 */}
      <FaCamera className="text-base shrink-0" />

      {/* ホバーした時だけ表示されるテキスト */}
      <span className="w-0 overflow-hidden text-xs font-medium whitespace-nowrap transition-all duration-200 group-hover:ml-2 group-hover:w-16">
        画像を変更
      </span>
    </button>
  );
}
