import { NewsBlockData } from "@/features/block";
import { NewsCard } from "@/components/news/news-card";
import { SiteMode } from "@/types/site";

type Props = NewsBlockData & {
  limit?: number;
  mode?: SiteMode;
};

export default function NewsBlock(props: Props) {
  const data = props;
  const { limit = 5 } = props;
  if (!data) {
    return (
      <div className="bg-white px-6 py-14">
        <div className="mx-auto max-w-5xl rounded-lg bg-red-50 p-6 text-red-700 shadow-sm">
          ニュースのデータが見つかりませんでした。
        </div>
      </div>
    );
  }

  const now = new Date();

  const sortedItems = data.items
    .filter((item) => new Date(item.publishedAt) <= now)
    .sort(
      (a, b) =>
        new Date(b.eventDate ?? b.publishedAt).getTime() -
        new Date(a.eventDate ?? a.publishedAt).getTime(),
    );
  // console.log("✨✨✨sortedItems", sortedItems);

  const displayedItems =
    limit !== undefined ? sortedItems.slice(0, limit) : sortedItems;
  // console.log("✨✨✨displayedItems", displayedItems);

  return (
    <div className="bg-slate-50 px-6 py-14 text-gray-800">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">News</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">お知らせ</h2>
          </div>
          <p className="max-w-xl leading-7 text-gray-600">
            お知らせを新しい順に掲載しています。
          </p>
        </div>

        <div className="grid gap-4">
          {displayedItems.map((item, index) => {
            const key = `news-${index}-${item.id}`;
            return <NewsCard key={key} {...item} />;
          })}
        </div>
      </div>
    </div>
  );
}
