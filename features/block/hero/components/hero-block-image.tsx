import Image from "next/image";

import ImageUploader from "@/components/media/image-uploader";
import { HeroBlockData } from "@/features/block";

type Props = HeroBlockData & {
  onOpenImageUploader: () => void;
  edit?: boolean;
};

export default function HeroBlockSingleImage(props: Props) {
  const data = props;
  const { edit, onOpenImageUploader } = props;
  const { title, message, images } = data;
  const image = images?.[0];

  return (
    <div className="relative min-h-[86svh] overflow-hidden bg-slate-900 px-6 text-white">
      <p>edit:{edit}</p>
      {/* カメラボタン */}
      {edit && (
        <div className="absolute right-4 top-4 z-20">
          <ImageUploader
            data={data}
            onOpenImageUploader={onOpenImageUploader}
          />
        </div>
      )}
      {image && (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
      <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-5xl flex-col items-center justify-center pb-28 pt-24 text-center">
        {/*<p className="text-sm font-semibold text-blue-100">Welcome</p>*/}
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
