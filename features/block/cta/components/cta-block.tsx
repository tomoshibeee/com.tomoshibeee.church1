import { FaArrowRight } from "react-icons/fa6";

import { CtaBlockData } from "@/features/block";

type Props = CtaBlockData &{
  edit?: boolean;
};
export default function CtaBlock(props: Props) {
  const { buttons = [], edit } = props;
  if (buttons.length === 0) return null;

  return (
    <div className="absolute bottom-10 left-1/2 z-20 w-full -translate-x-1/2 px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-stretch justify-center gap-3 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:rounded-full">
        {buttons.map((b, i) => (
          <a
            key={`${b.href}-${i}`}
            href={b.href}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition sm:min-w-44 sm:rounded-full ${
              i === 0
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "bg-slate-50 text-gray-800 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <span>{b.label}</span>
            <FaArrowRight className="text-xs" />
          </a>
        ))}
      </div>
    </div>
  );
}
