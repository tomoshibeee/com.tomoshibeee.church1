"use client";

import { MetaData } from "@/types/site-meta";
import { SectionData } from "@/features/section/types";
import { Block } from "@/features/block/index";
import BlockRenderer from "@/features/block/block-renderer";

type Props = {
  section: SectionData;
  meta: MetaData;
  onOpenImageUploader: () => void;
  edit?: boolean;
};
export default function BaseSection(props: Props) {
  const { section, meta, edit, onOpenImageUploader } = props;
  if (!section) return null;
  return (
    <section id={section.id} className="p-0 text-gray-800">
      {(section.blocks ?? []).map((block, i) => (
        <BlockRenderer
          key={block.id ?? `${block.type}-${i}`}
          meta={meta}
          block={block}
          onOpenImageUploader={onOpenImageUploader}
          edit={edit}
        />
      ))}
    </section>
  );
}
