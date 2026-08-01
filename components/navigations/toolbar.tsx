"use client";

import { useRouter } from "next/navigation";
import { UserData } from "@/types/user";
import { LoginButton, SignupButton } from "@/components/buttons/auth";

type Props = {
  user?: UserData;
  onOpenMenuEditor?: () => void;
};

export function Toolbar({ user, onOpenMenuEditor }: Props) {
  const router = useRouter();

  // 未ログイン時に編集ボタンを押した際のログイン誘導処理
  const handleEditClick = () => {
    if (!user) {
      if (
        confirm(
          "メニューを編集するにはログインが必要です。ログイン画面へ移動しますか？"
        )
      ) {
        router.push("/login");
      }
      return;
    }

    onOpenMenuEditor?.();
  };

  return (
    <div className="bg-slate-900 text-white text-xs px-4 h-9 flex items-center justify-between z-50 shadow-sm">
      {/* 👈 左側: ステータス表示 */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            user ? "bg-blue-600 text-white" : "bg-amber-500 text-slate-900"
          }`}
        >
          {user ? "ログイン中" : "ゲスト閲覧中"}
        </span>
        <span className="text-slate-300 hidden sm:inline text-[11px]">
          {user
            ? `ログインユーザー: ${user.name}`
            : "ログインすると自分だけのショップサイトを作成・編集できます"}
        </span>
      </div>

      {/* 👉 右側: アクションボタン類 */}
      <div className="flex items-center gap-2">
        {/* メニュー編集ボタン（関数が渡されている場合のみ表示） */}
        {onOpenMenuEditor && (
          <button
            type="button"
            onClick={handleEditClick}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
          >
            ⚙️ メニュー編集
          </button>
        )}

        {/* ログイン・新規登録導線（未ログイン時のみ表示） */}
        {!user && (
          <div className="flex items-center gap-1.5 ml-1">
            <LoginButton />
            <SignupButton />
          </div>
        )}
      </div>
    </div>
  );
}