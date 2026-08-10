"use client";

import React from "react";
import { MetaData } from "@/types/site-meta";
import { SiteMode } from "@/types/site";
import { Section } from "@/features/section/types";
import BlockRenderer from "@/features/block/block-renderer";

type Props = {
  section: Section;
  meta: MetaData;
  onUpdateBlock: (blockId: string, updatedData: Record<string, any>) => void;
  onUpdateSection?: (
    sectionId: string,
    updatedFields: Record<string, any>,
  ) => void;
  onOpenMetaEditor: () => void;
  mode?: SiteMode;
  isSelected?: boolean; // 👈 1. 選択状態を受け取る
  onSelect?: (sectionId: string) => void; // 👈 2. 選択イベントを受け取る
};

export default function BaseSection(props: Props) {
  const {
    section,
    meta,
    mode = "view",
    isSelected = false,
    onSelect,
    onUpdateBlock,
    onUpdateSection,
    onOpenMetaEditor,
  } = props;

  if (!section) return null;

  const isEdit = mode === "edit";

  // 💡 section.data?.anchorId を優先参照するように変更
  const anchorId = section.data?.anchorId || section.type || section.id;

  // ✍️ data オブジェクト内に anchorId を詰めて親へ渡す
  const handleAnchorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateSection) return;
    onUpdateSection(section.id, {
      data: {
        ...section.data,
        anchorId: e.target.value,
      },
    });
  };

  return (
    <section
      id={anchorId}
      onClick={isEdit && onSelect ? () => onSelect(section.id) : undefined}
      className={`relative p-0 text-gray-800 scroll-mt-20 ${
        isEdit
          ? `outline-1 outline-offset-[-1px] ${
              isSelected ? "outline-2 outline-blue-500" : "outline-dashed outline-gray-300"
            }`
          : ""
      }`}
    >
      {/* 💡 editモード時：左上オーバーレイ入力欄 */}
      {isEdit && (
        <div className="absolute left-3 top-3 z-30 flex items-center gap-1 rounded-2xl bg-slate-900/80 px-2.5 py-1 text-xs text-white shadow-md backdrop-blur-sm">
          <span className="font-mono text-slate-400">#</span>
          <input
            type="text"
            value={section.data?.anchorId ?? ""}
            onChange={handleAnchorIdChange}
            placeholder={section.type || "section"}
            className="w-28 border-b border-white/30 bg-transparent font-mono text-xs text-white placeholder-slate-400 focus:border-white focus:outline-none"
          />
        </div>
      )}

      {(section.blocks ?? []).map((block, i) => (
        <BlockRenderer
          key={block.id ?? `${block.type}-${i}`}
          meta={meta}
          block={block}
          onUpdateBlock={onUpdateBlock}
          onOpenMetaEditor={onOpenMetaEditor}
          mode={mode}
        />
      ))}
    </section>
  );
}