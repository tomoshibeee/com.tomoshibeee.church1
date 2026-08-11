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
  isSelected?: boolean;
  onSelect?: (sectionId: string) => void;
  // 💡 ブロック移動用ハンドラーを Props に追加
  onMoveBlock?: (blockId: string, direction: "up" | "down") => void;
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
    onMoveBlock, // 👈 追加
  } = props;

  if (!section) return null;

  const isEdit = mode === "edit";

  const anchorId = section.data?.anchorId || section.type || section.id;

  const handleAnchorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateSection) return;
    onUpdateSection(section.id, {
      data: {
        ...section.data,
        anchorId: e.target.value,
      },
    });
  };

  const blocks = section.blocks ?? [];

  return (
    <section
      id={anchorId}
      onClick={isEdit && onSelect ? () => onSelect(section.id) : undefined}
      className={`relative p-0 text-gray-800 scroll-mt-20 ${
        isEdit
          ? `outline-1 outline-offset-[-1px] ${
              isSelected
                ? "outline-2 outline-blue-500"
                : "outline-dashed outline-gray-300"
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

      {blocks.map((block, i) => (
        <BlockRenderer
          key={block.id ?? `${block.type}-${i}`}
          meta={meta}
          block={block}
          onUpdateBlock={onUpdateBlock}
          onOpenMetaEditor={onOpenMetaEditor}
          mode={mode}
          // 💡 ここで BlockRenderer に移動用の props を渡します
          onMoveBlock={onMoveBlock}
          isFirst={i === 0}
          isLast={i === blocks.length - 1}
        />
      ))}
    </section>
  );
}