import { SiteData } from "@/types/site";

type Props = {
  site?: SiteData;
};

export function Logo(props: Props) {
  const { site } = props;
  if (!site) {
    return (
      // TODO : ロゴ画像の表示
      // {site.meta.logoUrl ? (
      //   <img src={site.meta.logoUrl} />
      // ) : (
      //   <FallbackLogo />
      // )}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white text-sm font-bold">
          o
        </div>
        <span className="text-base font-semibold text-gray-900">omisee</span>
      </div>
    );
  }

  return (
    // TODO : ロゴ画像の表示
    // {site.meta.logoUrl ? (
    //   <img src={site.meta.logoUrl} />
    // ) : (
    //   <FallbackLogo />
    // )}
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white text-sm font-bold">
        {" "}
        {site.meta.name?.[0] ?? "C"}
      </div>

      <span className="text-base font-semibold text-gray-900">
        {site.meta.name}
      </span>
    </div>
  );
}
