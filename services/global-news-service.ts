import { supabase } from "@/lib/supabase";

import { NewsItem } from "@/features/block/news/types";

import { GlobalNews } from "@/models/global-news";

export async function getGlobalNews(): Promise<GlobalNews[]> {
  const { data, error } = await supabase
    .from("t_global_news")
    .select("*")
    .order("published_at", { ascending: false })
    // .limit(5)
    ;

  if (error) {
    console.error(`Error fetching global news":`, error);
    throw error;
  }

  return data;
}

export function toGlobalNewsItem(n: GlobalNews): NewsItem {
  return {
    id: n.id ?? "",
    title: n.title,
    content: n.content ?? "",
    eventDate: n.event_date,
    publishedAt: n.published_at,
  };
}

export function toGlobalNewsItems(globalNews: GlobalNews[]): NewsItem[] {
  return globalNews.map(n => toGlobalNewsItem(n));
}