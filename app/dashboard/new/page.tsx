// app/dashboard/new/page.tsx
"use client";

import { useState, useTransition } from "react";
import { createSiteAction } from "@/app/actions/site"; // パスはプロジェクトに合わせて調整してください

export default function NewSitePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!name.trim() || !slug.trim()) {
      setErrorMsg("サイト名とslugを入力してください。");
      return;
    }

    setErrorMsg(null);

    startTransition(async () => {
      // Server Action側で generateInitialSiteData(name, slug) を実行して保存
      const res = await createSiteAction(name.trim(), slug.trim());

      // 成功時は Action 内の redirect で自動遷移します
      // 失敗した場合のみエラーを表示
      if (res && !res.success) {
        setErrorMsg(res.error || "サイトの作成に失敗しました。");
      }
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl mb-4 font-bold">Create New Site</h1>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded max-w-md text-sm">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">サイト名</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="例: 静岡城南キリスト教会"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            slug (URL識別子)
          </label>
          <input
            className="border p-2 rounded w-full"
            placeholder="例: shizuoka-jonan-church"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={isPending}
          />
        </div>

        <button
          className="bg-black text-white p-2 rounded font-medium disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
          onClick={handleCreate}
          disabled={isPending}
        >
          {isPending ? "作成中..." : "Create"}
        </button>
      </div>
    </div>
  );
}
