import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Template from "@/components/templates/template";
import SiteNavigation from "@/components/navigations/site-navigation";
import { getSiteData } from "@/services/site-service";
import {
  getGlobalNews,
  toGlobalNewsItems,
} from "@/services/global-news-service";
import { UserData } from "@/types/user";

export default async function Page({
  params,
}: {
  params: Promise<{ "site-id": string }>;
}) {
  const session = await getSession();
  let userId = "";
  let userName = "";
  let userAvatar = "";
  if (session?.user) {
    userId = session.user.id;
    userName =
      session.user.user_metadata?.full_name ||
      session.user.user_metadata?.name ||
      session.user.email;
    userAvatar = session.user.user_metadata?.avatar_url;
  } else {
    redirect("/login");
  }
  const user: UserData = { id: userId, name: userName, avator: userAvatar };

  const { "site-id": siteId } = await params;

  const news = await getGlobalNews();
  const newsItems = toGlobalNewsItems(news);

  if (!siteId) return <div>Site Not Found</div>;

  const site = await getSiteData(siteId);
  if (!site) return <div>Not Found</div>;

  if (!Template) return <div>Template Not Found</div>;

  return <SiteNavigation site={site} newsItems={newsItems} user={user} />;
}
