import { getSession } from "@/lib/auth"; // 💡 セッションチェックを復活！
import { UserData } from "@/types/user";
import { getSiteMetas } from "@/services/site-meta-service";
import { getGlobalNews, toGlobalNewsItems } from "@/services/global-news-service";

import Footer from "@/components/shared/footer";
import { SiteLink } from "@/components/site-link/site-link";
import { PortalNavigation } from "@/components/navigations/portal-navigation";

export default async function Page() {
  // 1. ログイン状態（セッション）をチェック（ただし、未ログインでもリダイレクトはしない）
  const session = await getSession();
  
  let userName = "";
  let userAvatar = "";
  if (session?.user) {
    userName =
      session.user.user_metadata?.full_name ||
      session.user.user_metadata?.name ||
      session.user.email ||
      "";
    userAvatar = session.user.user_metadata?.avatar_url || "";
  }

  // ログイン中ならUserDataを作成、未ログインならundefinedにする
  const user: UserData | undefined = session?.user 
    ? { name: userName, avator: userAvatar } 
    : undefined;

  // 2. データの取得
  const siteMetas = await getSiteMetas();
  const news = await getGlobalNews();
  const newsItems = toGlobalNewsItems(news);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      {/* 
        💡 ここに user を渡してあげるだけ！
        - ログイン前 ➔ undefined が渡り、「お知らせ ＋ ログイン動線」になる
        - ログイン後 ➔ ユーザーデータが渡り、「お知らせ ➔ アバターメニュー」に自動で切り替わる！
      */}
      <PortalNavigation user={user} newsItems={newsItems} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 md:px-6">
        
        {/* 🚀 キャッチコピーセクション */}
        <section className="mb-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-md md:p-12">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl mb-3">
            omisee
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-xl leading-relaxed">
            街のお気に入りのお店が、きっと見つかる。
            こだわりのローカルショップや特設サイトが集まるポータルスペースです。
          </p>
        </section>

        {/* 🏢 お店一覧セクション */}
        <section>
          <div className="flex items-end justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="block text-xs font-bold tracking-widest text-blue-600 uppercase mb-1">
                Shop List
              </span>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                おみせを探す
              </h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-slate-100 px-2.5 py-1 rounded-full">
              見つかるお店: {siteMetas.length} 件
            </span>
          </div>

          {/* 💡 index画面なので、一般ユーザー（閲覧モード）として edit={false} で表示 */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {siteMetas.map((m) => (
              <SiteLink key={m.site_id} meta={m} edit={false} />
            ))}
          </div>
        </section>
        
      </main>

      <Footer />
    </div>
  );
}
