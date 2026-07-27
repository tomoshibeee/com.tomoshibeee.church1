"use client";

import React, { JSX } from "react";
import HeroBlockImage from "@/features/block/hero/components/hero-block-image";
import HeroBlockCarousel from "@/features/block/hero/components/hero-block-carousel";
import NewsBlock from "@/features/block/news/components/news-block";
import GreetingBlock from "@/features/block/greeting/components/greeting-block";
import ServiceBlock from "@/features/block/service/components/service-block";
import AccessBlock from "@/features/block/access/components/access-block";
import CtaBlock from "@/features/block/cta/components/cta-block";
import ContactBlock from "./contact/components/contact-block";

import { MetaData } from "@/types/site-meta";
import { SiteMode } from "@/types/site";
import {
  Block,
  HeroBlockType,
  NewsBlockType,
  GreetingBlockType,
  AccessBlockType,
  CtaBlockType,
  ServiceBlockType,
  ContactBlockType,
} from "@/features/block/index";
interface Props {
  meta: MetaData;
  block: Block;
  onUpdateBlock: (blockId: string, updatedData: Record<string, any>) => void;
  onOpenMetaEditor: () => void;
  mode?: SiteMode;
}
type BlockRendererMap = {
  hero: (
    block: HeroBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    mode?: SiteMode,
  ) => JSX.Element;
  news: (
    block: NewsBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    mode?: SiteMode,
  ) => JSX.Element;
  greeting: (
    block: GreetingBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    mode?: SiteMode,
  ) => JSX.Element;
  access: (
    block: AccessBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    mode?: SiteMode,
  ) => JSX.Element;
  cta: (
    block: CtaBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    mode?: SiteMode,
  ) => JSX.Element;
  contact: (
    block: ContactBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    mode?: SiteMode,
  ) => JSX.Element;
  service: (
    block: ServiceBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    mode?: SiteMode,
  ) => JSX.Element;
};

const blockRegistry: BlockRendererMap = {
  hero: (block, _meta, onUpdateBlock, _onOpenMetaEditor, mode) => {
    if (block.type !== "hero") return {} as JSX.Element;
    return block.variant === "carousel" ? (
      <HeroBlockCarousel
        {...block.data}
        onUpdateBlock={onUpdateBlock}
        mode={mode}
      />
    ) : (
      <HeroBlockImage
        {...block.data}
        onUpdateBlock={onUpdateBlock}
        mode={mode}
      />
    );
  },

  news: (block, _meta, _onUpdateBlock, onOpenMetaEditor, mode) => {
    if (block.type !== "news") return {} as JSX.Element;
    return <NewsBlock {...block.data} mode={mode} />;
  },

  greeting: (block, _meta, onUpdateBlock, _onOpenMetaEditor, mode) => {
    if (block.type !== "greeting") return {} as JSX.Element;
    return <GreetingBlock {...block.data} onUpdateBlock={onUpdateBlock} mode={mode} />;
  },

  service: (block, _meta, _onUpdateBlock, _onOpenMetaEditor, mode) => {
    return <ServiceBlock {...block.data} mode={mode} />;
  },

  contact: (block, meta, _onUpdateBlock, onOpenMetaEditor, mode) => {
    return <ContactBlock {...block.data} meta={meta} onOpenMetaEditor={onOpenMetaEditor} mode={mode} />;
  },

  access: (_block, meta, _onUpdateBlock, onOpenMetaEditor, mode) => {
    if (!meta) throw new Error("meta missing");
    return <AccessBlock {...meta} onOpenMetaEditor={onOpenMetaEditor} mode={mode} />;
  },

  cta: (block, _meta, _onUpdateBlock, _onOpenMetaEditor, mode) => {
    if (block.type !== "cta") return {} as JSX.Element;
    return <CtaBlock {...block.data} mode={mode} />;
  },
};

export default function BlockRenderer(props: Props) {
  const { meta, block, mode = "view", onUpdateBlock, onOpenMetaEditor } = props;
  const render = blockRegistry[block.type];

  if (!render) return null;

  const handleUpdateFields = (updatedData: Record<string, any>) => {
    if (block.id) {
      onUpdateBlock(block.id, updatedData);
    }
  };

  const content = render(block as any, meta, handleUpdateFields, onOpenMetaEditor, mode);

  return <div>{content}</div>;
}
