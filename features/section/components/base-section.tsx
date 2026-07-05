"use client";

import { MetaData } from "@/types/site-meta";
import { SectionData } from "@/features/section/types";
import BlockRenderer from "@/features/block/block-renderer";

type Props = {
  section: SectionData;
  meta: MetaData;
  onUpdateBlock: (blockId: string, updatedData: Record<string, any>) => void;
  onOpenMetaEditor: () => void;
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
          onUpdateBlock={onUpdateBlock} 
          onOpenMetaEditor={props.onOpenMetaEditor}
          edit={edit}
        />
      ))}
    </section>
  );
}