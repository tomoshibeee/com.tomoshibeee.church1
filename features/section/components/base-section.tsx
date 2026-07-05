"use client";

import { MetaData } from "@/types/site-meta";
import { SectionData } from "@/features/section/types";
import BlockRenderer from "@/features/block/block-renderer";

type Props = {
  section: SectionData;
  meta: MetaData;
  // 💡 型を引数ありに変更
  onUpdateBlock: (blockId: string, updatedData: Record<string, any>) => void;
  edit?: boolean;
};

export default function BaseSection(props: Props) {
  const { section, meta, edit, onUpdateBlock } = props;
  if (!section) return null;
  return (
    <section id={section.id} className="p-0 text-gray-800">
      {(section.blocks ?? []).map((block, i) => (
        <BlockRenderer
          key={block.id ?? `${block.type}-${i}`}
          meta={meta}
          block={block}
          onUpdateBlock={onUpdateBlock} // 💡 そのまま下へバケツリレー
          edit={edit}
        />
      ))}
    </section>
  );
}