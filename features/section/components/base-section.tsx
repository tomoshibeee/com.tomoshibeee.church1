"use client";

import { MetaData } from "@/types/site-meta";
import { SiteMode } from "@/types/site";
import { SectionData } from "@/features/section/types";
import BlockRenderer from "@/features/block/block-renderer";

type Props = {
  section: SectionData;
  meta: MetaData;
  onUpdateBlock: (blockId: string, updatedData: Record<string, any>) => void;
  onUpdateSection?: (sectionId: string, updatedFields: Record<string, any>) => void;
  onOpenMetaEditor: () => void;
  mode?: SiteMode;
};

export default function BaseSection(props: Props) {
  const {
    section,
    meta,
    mode = "view",
    onUpdateBlock,
    onUpdateSection,
    onOpenMetaEditor,
  } = props;

  if (!section) return null;

  const isEdit = mode === "edit";

  // 💡 表示・HTMLのidとして使用するアンカーID
  const anchorId = section.anchorId || section.type || section.id;

  // ✍️ アンカーID変更用（HeroBlockSingleImage の handleTitleChange などと同じパターン）
  const handleAnchorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpdateSection) return;
    onUpdateSection(section.id, {
      anchorId: e.target.value,
    });
  };

  return (
    <section id={anchorId} className="relative p-0 text-gray-800 scroll-mt-20">
      {/* 💡 editモード時：HeroBlockと同じスタイルの左上オーバーレイ入力欄 */}
      {isEdit && (
        <div className="absolute left-3 top-3 z-30 flex items-center gap-1 rounded.2xl bg-slate-900/80 px-2.5 py-1 text-xs text-white shadow-md backdrop-blur-sm">
          <span className="font-mono text-slate-400">#</span>
          <input
            type="text"
            value={section.anchorId ?? ""}
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