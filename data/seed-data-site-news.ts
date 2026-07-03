import { randomUUID } from "crypto";

import { getRandomDate } from "@/utils/date/get-random-date";

import { dummySiteNews } from "@/lib/data";

export function dummySiteNewsModelData(siteIds: string[]) {
  const now = new Date().toISOString();

  return dummySiteNews.flatMap((siteNews, i) => {
    return siteNews.map((n, j) => {
      return {
        id: randomUUID(),
        site_id: siteIds[i],
        title: n.title,
        content: n.content,
        doc: n.doc,
        youtube: n.youtube,
        published_at: getRandomDate(),
        event_date: getRandomDate(),
        created_at: now,
        updated_at: now,
      }
    })
  });
}