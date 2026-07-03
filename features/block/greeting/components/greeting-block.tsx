import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa6";

import { GreetingBlockData } from "@/features/block";

type Props = GreetingBlockData & {
  edit?: boolean;
};

export default function GreetingBlock(props: Props) {
  const data = props;
  const { edit } = props;
  if (!data.name.trim()) return null;

  return (
    <div className="bg-white px-6 py-14 text-gray-800">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        <div className="rounded-lg bg-slate-50 p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-full ring-4 ring-white">
              <Image
                src={data.image}
                alt={data.name}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>

            <div className="mt-5">
              <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
              {data.role && (
                <p className="mt-1 text-sm font-medium text-blue-600">
                  {data.role}
                </p>
              )}
            </div>

            {data.bio && (
              <p className="mt-4 text-sm leading-7 text-gray-600">{data.bio}</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">Greeting</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {data.role ? `${data.role}からの` : ""}ごあいさつ
            </h2>
          </div>

          {data.message && (
            <blockquote className="relative rounded-lg bg-slate-50 p-6 text-gray-700 shadow-sm">
              <FaQuoteLeft className="mb-4 text-2xl text-blue-500" />
              <p className="leading-8">{data.message}</p>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
