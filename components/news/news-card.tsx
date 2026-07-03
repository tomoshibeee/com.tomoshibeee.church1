import {
  FaArrowRight,
  FaCalendarDays,
  FaFileLines,
  FaYoutube,
} from "react-icons/fa6";

import { formatDate } from "@/utils/date/format-date";
import { NewsItem } from "@/features/block/news/types";

export function NewsCard(props: NewsItem) {
  // console.log("🚦🚦🚦props🚦🚦🚦", props);
  const { id, title, content, eventDate, publishedAt, doc, youtube } = props;
  const isLong = content && content.length > 60;
  // console.log("🚦🚦🚦date🚦🚦🚦", id, eventDate, publishedAt);
  return (
    <article className="grid gap-5 rounded-lg bg-white p-5 shadow-sm transition hover:shadow-md md:grid-cols-[150px_1fr_auto]">
      <div className="flex items-center gap-3 text-sm font-semibold text-blue-600 md:items-start">
        <FaCalendarDays className="mt-0.5 shrink-0" />
        <time dateTime={eventDate || publishedAt}>
          {formatDate(eventDate || publishedAt)}
        </time>
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>

        {content && (
          <p
            className={`mt-2 text-sm leading-7 text-gray-600 md:text-base ${
              isLong ? "line-clamp-2" : ""
            }`}
          >
            {content}
          </p>
        )}

        {isLong && (
          <a
            href="#access"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            詳しくはこちら
            <FaArrowRight className="text-xs" />
          </a>
        )}
      </div>

      <div className="flex gap-2 md:justify-end">
        {doc && (
          <a
            href={doc}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title}の資料を開く`}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            <FaFileLines />
          </a>
        )}

        {youtube && (
          <a
            href={youtube}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title}の動画を開く`}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            <FaYoutube />
          </a>
        )}
      </div>
    </article>
  );
}
