import { supabase } from "@/lib/supabase";

import { NewsItem } from "@/features/block/news/types";

import { SiteNews } from "@/models/site-news";

export async function getSiteNews(siteId: string): Promise<SiteNews[]> {
    const { data, error } = await supabase
        .from("t_site_news")
        .select("*")
        .eq("site_id", siteId)
        .order("published_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error(`Error fetching news for site ID "${siteId}":`, error);
        throw error;
    }

    return data;
}

export function toSiteNewsItem(n: SiteNews): NewsItem {
    return {
        id: n.id,
        title: n.title,
        content: n.content ?? "",
        eventDate: n.event_date,
        publishedAt: n.published_at,
    };
}

export function toSiteNewsItems(siteNews: SiteNews[]): NewsItem[] {
    return siteNews.map(n => toSiteNewsItem(n));

}