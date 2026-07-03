import Template from "@/components/templates/template";
import SiteNavigation from "@/components/navigations/site-navigation";

import { getSiteData } from "@/services/site-service";

export default async function Page({
  params,
}: {
  params: Promise<{ "site-id": string }>;
}) {
  const { "site-id": siteId } = await params;

  if (!siteId) return <div>Site Not Found</div>;

  const site = await getSiteData(siteId);
  if (!site) return <div>Not Found</div>;

  if (!Template) return <div>Template Not Found</div>;

  return <SiteNavigation site={site} />;
}
