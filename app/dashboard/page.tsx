import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth"; // TODO : 仮

import { UserData } from "@/types/user";

import { getSiteMetas } from "@/services/site-meta-service";
import {
  getGlobalNews,
  toGlobalNewsItems,
} from "@/services/global-news-service";

import Footer from "@/components/shared/footer";

import { AddSiteButton } from "@/components/buttons/add-site-button";
import { SiteLink } from "@/components/site-link/site-link";

import { DashboardNavigation } from "@/components/navigations/dashboard-navigation";

export default async function Page() {
  const session = await getSession();
  let userName = "";
  let userAvatar = "";
  if (session?.user) {
    userName =
      session.user.user_metadata?.full_name ||
      session.user.user_metadata?.name ||
      session.user.email;
    userAvatar = session.user.user_metadata?.avatar_url;
  }

  const siteMetas = await getSiteMetas();

  if (!session) {
    redirect("/login");
  }

  const user: UserData = { name: userName, avator: userAvatar };

  const news = await getGlobalNews();
  const newsItems = toGlobalNewsItems(news);

  return (
    <>
      <DashboardNavigation user={user} newsItems={newsItems} />
      <main style={{ padding: "20px" }}>
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Sites</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <AddSiteButton />
            {siteMetas.map((m) => (
              <SiteLink key={m.site_id} meta={m} mode="edit" />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
