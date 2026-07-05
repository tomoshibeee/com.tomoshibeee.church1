"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FaXmark, FaPlus, FaTrash } from "react-icons/fa6";
import { MenuItem } from "@/types/site-menu"; // 実際のパスに合わせて調整してください

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MenuItem[]; // site.navigation.menu の配列
  onSave: (updatedMenu: MenuItem[]) => void;
}

export function MenuModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: MenuModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<{ menu: MenuItem[] }>({
    defaultValues: { menu: initialData },
  });

  // 【第1階層】メインメニューの制御
  const {
    fields: parentFields,
    append: appendParent,
    remove: removeParent,
  } = useFieldArray({
    control,
    name: "menu",
  });

  useEffect(() => {
    if (isOpen) {
      reset({ menu: initialData });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: { menu: MenuItem[] }) => {
    try {
      await onSave(data.menu);
      onClose();
    } catch (error) {
      console.error("Failed to save navigation menu:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center md:items-center">
      {/* 🌫️ 背景の黒透明 */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 📦 モーダル本体 */}
      <div
        className="relative z-10 w-full rounded-t-2xl bg-white p-6 shadow-2xl transition-all duration-300 md:max-w-xl md:rounded-2xl h-[85vh] md:h-[80vh] flex flex-col
        animate-in fade-in slide-in-from-bottom md:zoom-in-95"
      >
        {/* 上部のタイトルバー */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0 border-b border-slate-50 pb-2">
          <h3 className="text-sm font-bold text-gray-800">
            ナビゲーションメニューの編集
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <FaXmark size={18} />
          </button>
        </div>

        {/* フォーム入力エリア */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto pr-1 pb-4 flex-1 scrollbar-thin space-y-6"
        >
          {/* 【第1階層】メインメニューのループ */}
          {parentFields.map((parentField, parentIndex) => {
            const hasChildren =
              watch(`menu.${parentIndex}.children`) &&
              watch(`menu.${parentIndex}.children`)!.length > 0;

            return (
              <div
                key={parentField.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative group/menu"
              >
                {/* メニュー削除ボタン */}
                <button
                  type="button"
                  onClick={() => removeParent(parentIndex)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="メニューを削除"
                >
                  <FaTrash size={14} />
                </button>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* メニューの表示名 (label) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      メニュー名（ラベル）
                    </label>
                    <input
                      type="text"
                      {...register(`menu.${parentIndex}.label` as const, {
                        required: true,
                      })}
                      placeholder="例: 教会紹介"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* リンク先 (href) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      リンク先URL{" "}
                      {hasChildren && (
                        <span className="text-red-500 text-[10px]">
                          (子要素優先)
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      {...register(`menu.${parentIndex}.href` as const)}
                      disabled={hasChildren}
                      placeholder="例: #about, /news"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>

                {/* オプション設定（タイプ・アイコン） */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* メニュー種別 (type) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      メニュータイプ
                    </label>
                    <select
                      {...register(`menu.${parentIndex}.type` as const)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="link">通常リンク</option>
                      <option value="news">お知らせモーダル起動</option>
                      <option value="logout">ログアウト</option>
                    </select>
                  </div>

                  {/* アイコン名 (icon) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      アイコン（任意）
                    </label>
                    <input
                      type="text"
                      {...register(`menu.${parentIndex}.icon` as const)}
                      placeholder="例: FaHome, FaInfo"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 【第2階層】サブメニュー（children）の管理エリア */}
                <div className="bg-white p-3 rounded-lg border border-slate-100">
                  <span className="block text-xs font-bold text-slate-600 mb-2">
                    子メニュー（ドロップダウン）
                  </span>
                  <MenuChildrenFields
                    parentIndex={parentIndex}
                    control={control}
                    register={register}
                  />
                </div>
              </div>
            );
          })}

          {/* 新しいメインメニューを追加するボタン */}
          <button
            type="button"
            onClick={() => appendParent({ label: "", href: "", type: "link" })}
            className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FaPlus size={12} />
            新しいメニューを追加
          </button>

          {/* 💾 アクションボタンエリア */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {isSubmitting ? "保存中..." : "変更を保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** ==========================================
 * 【第2階層】子メニュー（children）用のループコンポーネント
 * ========================================== */
function MenuChildrenFields({
  parentIndex,
  control,
  register,
}: {
  parentIndex: number;
  control: any;
  register: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `menu.${parentIndex}.children`,
  });

  return (
    <div className="space-y-2">
      {fields.map((childField, childIndex) => (
        <div
          key={childField.id}
          className="flex gap-2 items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100"
        >
          {/* 子メニューの表示名 (label) */}
          <div className="flex-1">
            <input
              type="text"
              {...register(
                `menu.${parentIndex}.children.${childIndex}.label` as const,
                { required: true },
              )}
              placeholder="子メニュー名 (例: 牧師紹介)"
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 子メニューのリンク先 (href) */}
          <div className="flex-1">
            <input
              type="text"
              {...register(
                `menu.${parentIndex}.children.${childIndex}.href` as const,
                { required: true },
              )}
              placeholder="リンク (例: #about)"
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 子要素用のtype（オプション、必要に応じてセレクトボックス等に拡張可能。今回は非表示または初期値設定） */}
          <input
            type="hidden"
            {...register(
              `menu.${parentIndex}.children.${childIndex}.type` as const,
            )}
            value="link"
          />

          {/* 子メニュー削除ボタン */}
          <button
            type="button"
            onClick={() => remove(childIndex)}
            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-1"
          >
            <FaTrash size={12} />
          </button>
        </div>
      ))}

      {/* 子メニューを追加するボタン */}
      <button
        type="button"
        onClick={() => append({ label: "", href: "", type: "link" })}
        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer mt-1 pl-1"
      >
        <FaPlus size={10} />
        子メニューを追加
      </button>
    </div>
  );
}
