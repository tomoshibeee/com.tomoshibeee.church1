"use client";

import { useRouter } from "next/navigation";
import { UserData } from "@/types/user";

type Props = {
  user?: UserData;
  onOpenMenuEditor?: () => void;
};

export function Toolbar({ user, onOpenMenuEditor }: Props) {
  const router = useRouter();

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
    <div className="bg-slate-900 text-white text-xs px-4 h-9 flex items-center justify-between z-50">
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            user ? "bg-blue-600 text-white" : "bg-amber-500 text-slate-900"
          }`}
        >
          {user ? "編集中" : "ゲスト閲覧中"}
        </span>
        <span className="text-slate-300 hidden sm:inline">
          {user
            ? "変更はリアルタイムに反映されます"
            : "ログインすると自分だけのLPを作成・保存できます"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleEditClick}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
        >
          ⚙️ メニュー編集
        </button>

        {!user && (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded font-bold transition-colors cursor-pointer"
          >
            ログイン
          </button>
        )}
      </div>
    </div>
  );
}