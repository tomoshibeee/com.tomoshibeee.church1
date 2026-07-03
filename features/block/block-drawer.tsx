"use client";

import { IoIosCloseCircleOutline } from "react-icons/io";

import { Block } from "@/features/block/index";
import { HeroBlockData } from "@/features/block";

import HeroForm from "@/features/block/hero/components/hero-form";

type Props = {
  block: Block;
  open: boolean;
  onClose: () => void;
  onChange: (block: Block) => void;
};

export function BlockDrawer(props: Props) {
  const { block, open, onClose, onChange } = props;
  const baseDrawerClass =
    "fixed top-0 right-0 h-full w-96 bg-slate-100 shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto pb-10";
  const drawerClass = open
    ? `${baseDrawerClass} translate-x-0`
    : `${baseDrawerClass} translate-x-full`;

  const baseOverlayClass = "fixed inset-0 z-100 bg-black/40 z-40";
  const overlayClass = open
    ? `${baseOverlayClass} transition-opacity duration-300 opacity-100 block`
    : `${baseOverlayClass} transition-opacity duration-300 opacity-0 hidden`;

  let content = null;

  if (block.type === "hero") {
    const data = block.data as HeroBlockData;
    content = (
      <HeroForm
        data={block.data}
        onChange={(data) => onChange({ ...block, data })}
      />
    );
  } else {
    content = <div>未実装</div>;
  }
  return (
    <>
      <div className={overlayClass} onClick={onClose} />

      <div className={drawerClass}>
        <button onClick={onClose}>
          <IoIosCloseCircleOutline />
        </button>

        <section className="p-6">
          <h2>
            {block.type}-{block.id}
          </h2>

          {content}
        </section>
      </div>
    </>
  );
}
