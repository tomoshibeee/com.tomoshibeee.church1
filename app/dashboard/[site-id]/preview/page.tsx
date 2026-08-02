import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserData } from "@/types/user";
import PreviewClient from "./preview-client";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ "site-id": string }>;
}) {
  // サーバー側でセッションチェック（ブラウザに画面を描画する前に判定）
  const session = await getSession();

  // 未ログインユーザーは即座にログイン画面へリダイレクト
  if (!session?.user) {
    redirect("/login");
  }

  let userName = "";
  let userAvatar = "";
  userName =
    session.user.user_metadata?.full_name ||
    session.user.user_metadata?.name ||
    session.user.email;
  userAvatar = session.user.user_metadata?.avatar_url;
  const user: UserData = { name: userName, avator: userAvatar };

  const { "site-id": siteId } = await params;

  // 認証OKの場合のみクライアントコンポーネントを返す
  return <PreviewClient siteId={siteId} user={user} />;
}
