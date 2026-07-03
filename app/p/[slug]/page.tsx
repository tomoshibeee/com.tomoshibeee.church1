import { getSiteIdBySlug } from "@/services/site-service";
import { getSiteData } from "@/services/site-service";
import { getGlobalNews, toGlobalNewsItems } from "@/services/global-news-service";

import Template from "@/components/templates/template";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const siteId = await getSiteIdBySlug(slug);
  if (!siteId) return <div>Site Not Found</div>;

  const site = await getSiteData(siteId);
  if (!site) return <div>Not Found</div>;

  if (!Template) return <div>Template Not Found</div>;

  const news = await getGlobalNews();
  const newsItems = toGlobalNewsItems(news);

  return <Template site={site} edit={false} newsItems={newsItems} />;
}
