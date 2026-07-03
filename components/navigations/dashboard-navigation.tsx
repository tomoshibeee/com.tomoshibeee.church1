"use client";

import Header from "@/components/shared/header";
import { UserData } from "@/types/user";
import { NewsItem } from "@/features/block/news/types";

type Props = {
  user?: UserData;
  newsItems: NewsItem[]; // 💡 ドロワーを開く関数ではなく、お知らせデータ自体を受け取るように変更
};

export function DashboardNavigation({ user, newsItems }: Props) {
  return (
    <>
      <Header user={user} newsItems={newsItems} />
    </>
  );
}
