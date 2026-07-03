import { FaLocationDot, FaTrain } from "react-icons/fa6";

import MapBlock from "./map-embed";

import { MetaData } from "@/types/site-meta";

type Props = MetaData & {
  edit?: boolean;
};

export default function AccessBlock(props: Props) {
  const meta = props;
  const mapAddress = [
    meta.postalCode && `〒${meta.postalCode}`,
    meta.address,
    meta.bldg,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="bg-white px-6 py-14 text-gray-800">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">Access</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">アクセス</h2>
            <p className="mt-4 leading-7 text-gray-600">
              初めてお越しの方も迷わず来られるよう、所在地と最寄りからの道順をご確認ください。
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3 shadow-sm">
              <FaLocationDot className="mt-1 shrink-0 text-blue-500" />
              <span className="leading-6">
                {meta.postalCode && (
                  <>
                    〒{meta.postalCode}
                    <br />
                  </>
                )}
                {meta.address}
                {meta.bldg && (
                  <>
                    <br />
                    {meta.bldg}
                  </>
                )}
              </span>
            </div>

            {meta.access && (
              <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3 shadow-sm">
                <FaTrain className="mt-1 shrink-0 text-blue-500" />
                <span className="leading-6">{meta.access}</span>
              </div>
            )}
          </div>
        </div>

        {mapAddress && (
          <div className="rounded-lg bg-slate-50 p-3 shadow-md">
            <MapBlock address={mapAddress} />
          </div>
        )}
      </div>
    </div>
  );
}
