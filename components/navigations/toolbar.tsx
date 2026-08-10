"use client";

import { useRouter } from "next/navigation";
import { UserData } from "@/types/user";
import {
  LoginButton,
  SignupButton,
  LogoutButton,
} from "@/components/buttons/auth";
// 💡 もし LogoutButton が別コンポーネントとして存在する場合はインポートしてください
// import { LogoutButton } from "@/components/buttons/auth";

type Props = {
  user?: UserData;
  onOpenMenuEditor?: () => void;
  onOpenBlockEditor?: () => void;
};

export function Toolbar({ user, onOpenMenuEditor, onOpenBlockEditor }: Props) {
  const router = useRouter();

  const handleAuthCheck = (action?: () => void) => {
    if (!user) {
      if (
        confirm(
          "編集機能を利用するにはログインが必要です。ログイン画面へ移動しますか？",
        )
      ) {
        router.push("/login");
      }
      return;
    }

    action?.();
  };

  // 💡 ログアウト処理（プロジェクトの認証ロジックに合わせて調整してください）
  const handleLogout = async () => {
    // 例: supabase.auth.signOut() などの処理を実行
    router.push("/logout"); // またはログアウト用エンドポイントへ遷移
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 text-white text-xs px-4 h-10 flex items-center justify-between z-50 shadow-sm sticky top-0">
      {/* 左側: ステータス表示 */}
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${
            user
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              user ? "bg-blue-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          {user ? "ログイン中" : "ゲスト閲覧中"}
        </span>

        <span className="text-slate-400 hidden sm:inline text-[11px] font-normal truncate max-w-[280px] md:max-w-none">
          {user ? (
            <>
              ログインユーザー:{" "}
              <span className="text-slate-200 font-medium">{user.name}</span>
            </>
          ) : (
            "ログインすると自分だけのショップサイトを作成・編集できます"
          )}
        </span>
      </div>

      {/* 右側: アクションボタン類 */}
      <div className="flex items-center gap-2">
        {/* ブロック追加/編集ボタン */}
        {onOpenBlockEditor && (
          <button
            type="button"
            onClick={() => handleAuthCheck(onOpenBlockEditor)}
            className="group inline-flex items-center gap-1.5 bg-blue-600/80 hover:bg-blue-500/80 text-white px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 border border-blue-500/60 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400/20 active:scale-95"
          >
            <svg
              className="w-3.5 h-3.5 text-blue-200 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>ブロック追加</span>
          </button>
        )}

        {/* メニュー編集ボタン */}
        {onOpenMenuEditor && (
          <button
            type="button"
            onClick={() => handleAuthCheck(onOpenMenuEditor)}
            className="group inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 border border-slate-700/60 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400/20 active:scale-95"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors group-hover:rotate-45 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>メニュー編集</span>
          </button>
        )}

        {/* 💡 ログイン状態に応じたボタン切り替え */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
          {user ? (
            /* ログイン時: ログアウトボタン */
            <LogoutButton handleLogout={handleLogout} />
          ) : (
            /* 未ログイン時: ログイン / 新規登録ボタン */
            <>
              <LoginButton />
              <SignupButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
