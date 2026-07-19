import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth"; // TODO : 仮

import { UserData } from "@/types/user";

import { getSiteMetas } from "@/services/site-meta-service";
import {
  getGlobalNews,
  toGlobalNewsItems,
} from "@/services/global-news-service";

import Footer from "@/components/shared/footer";
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
            {/* カード型の新規追加ボタン */}
            <button className="flex flex-col items-center justify-center min-h-[120px] rounded-lg border-2 border-dashed border-gray-300 bg-white p-5 text-gray-500 transition hover:border-blue-500 hover:text-blue-600 hover:shadow-md">
              <span className="text-2xl font-light mb-1">+</span>
              <span className="text-sm font-semibold">Add New Site</span>
            </button>

            {siteMetas.map((m) => (
              <SiteLink key={m.site_id} meta={m} edit={true} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
