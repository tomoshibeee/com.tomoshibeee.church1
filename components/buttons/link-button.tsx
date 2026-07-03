import { SiteSocialLink } from "@/models/site-social-link";
import {
  FaFacebook,
  FaXTwitter, // 💡 古い FaTwitter から最新の「X」アイコンに変更！
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaBlog,
} from "react-icons/fa6";

// 💡 型定義をより厳密にして安全性を高めました
const SNS_ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: FaFacebook,
  x: FaXTwitter, // 💡 マップも最新のXアイコンに差し替え
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  note: FaBlog,
};

function LinkButton({
  item,
  className,
}: {
  item: SiteSocialLink;
  className?: string;
}) {
  // 💡 シェアボタンと合わせて、18pxにすると線が細くなり一気に垢抜けます
  const SIZE = 18;
  const key = item.type_id.toLowerCase();
  const Icon = SNS_ICON_MAP[key];

  // 万が一アイコンが存在しない場合の防衛策
  if (!Icon) return null;

  return (
    <a
      href={item.url}
      aria-label={`${item.type_id}を開く`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} cursor-pointer inline-flex`}
    >
      <Icon size={SIZE} />
    </a>
  );
}

// 💡 Tailwindのバグを防ぐため、完全なクラス名で記述してデザインを今風に調整！
export function LinkButtonHeader({ item }: { item: SiteSocialLink }) {
  return (
    <LinkButton
      item={item}
      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-slate-100 hover:text-gray-900"
    />
  );
}

export function LinkButtonFooter({ item }: { item: SiteSocialLink }) {
  return (
    <LinkButton
      item={item}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all duration-200 hover:bg-white/15 hover:text-white"
    />
  );
}
