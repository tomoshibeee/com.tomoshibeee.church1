import { ServiceBlockData } from "@/features/block";

import {
  FaArrowRight,
  FaClock,
  FaLocationDot,
  FaRegCalendarCheck,
} from "react-icons/fa6";

const getGridCols = (count: number) => {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3";
};

type Props = ServiceBlockData & {
  edit?: boolean;
};

export default function ServiceBlock(props: Props) {
  const { items } = props;
  const gridCols = getGridCols(items.length);

  return (
    <div className="bg-white px-6 py-14 text-gray-800">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Service</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              サービスのご案内
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-gray-600">
            はじめての方も安心して参加できる、教会の主な礼拝と集会です。
          </p>
        </div>

        <div className={`grid ${gridCols} gap-5`}>
          {items.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col rounded-lg bg-slate-50 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-blue-600 text-white">
                <FaRegCalendarCheck />
              </div>

              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaClock className="shrink-0 text-blue-500" />
                  <span>{item.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaLocationDot className="shrink-0 text-blue-500" />
                  <span>{item.location}</span>
                </div>
              </div>

              {item.comment && (
                <p className="mt-5 flex-1 text-sm leading-7 text-gray-600">
                  {item.comment}
                </p>
              )}

              {item.link && (
                <a
                  href={item.link}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  詳しく見る
                  <FaArrowRight className="text-xs" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
