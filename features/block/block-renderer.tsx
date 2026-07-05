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
  edit?: boolean;
}
type BlockRendererMap = {
  hero: (
    block: HeroBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    edit?: boolean,
  ) => JSX.Element;
  news: (
    block: NewsBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    edit?: boolean,
  ) => JSX.Element;
  greeting: (
    block: GreetingBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    edit?: boolean,
  ) => JSX.Element;
  access: (
    block: AccessBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void, 
    edit?: boolean,
  ) => JSX.Element;
  cta: (
    block: CtaBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    edit?: boolean,
  ) => JSX.Element;
  contact: (
    block: ContactBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    edit?: boolean,
  ) => JSX.Element;
  service: (
    block: ServiceBlockType,
    meta: MetaData,
    onUpdateBlock: (updatedData: Record<string, any>) => void,
    onOpenMetaEditor: () => void,
    edit?: boolean,
  ) => JSX.Element;
};

const blockRegistry: BlockRendererMap = {
  hero: (block, _meta, onUpdateBlock, _onOpenMetaEditor, edit) => {
    if (block.type !== "hero") return {} as JSX.Element;
    return block.variant === "carousel" ? (
      <HeroBlockCarousel
        {...block.data}
        onUpdateBlock={onUpdateBlock}
        edit={edit}
      />  
    ) : (
      <HeroBlockImage
        {...block.data}
        onUpdateBlock={onUpdateBlock}
        edit={edit}
      />
    );
  },

  news: (block, _meta, _onUpdateBlock, onOpenMetaEditor, edit) => {
    if (block.type !== "news") return {} as JSX.Element;
    return <NewsBlock {...block.data} edit={edit} />;
  },

  greeting: (block, _meta, onUpdateBlock, _onOpenMetaEditor,    edit) => {
    if (block.type !== "greeting") return {} as JSX.Element;
    return <GreetingBlock {...block.data} onUpdateBlock={onUpdateBlock} edit={edit} />;
  },

  service: (block, _meta, _onUpdateBlock, _onOpenMetaEditor, edit) => {
    return <ServiceBlock {...block.data} edit={edit} />;
  },

  contact: (block, meta, _onUpdateBlock, onOpenMetaEditor, edit) => {
    return <ContactBlock {...block.data} meta={meta} onOpenMetaEditor={onOpenMetaEditor} edit={edit} />;
  },

  access: (_block, meta, _onUpdateBlock, onOpenMetaEditor, edit) => {
    // if (block.type !== "access") return {} as JSX.Element;
    if (!meta) throw new Error("meta missing");
    // if (!meta.slug) throw new Error("slug missing");
    return <AccessBlock {...meta} onOpenMetaEditor={onOpenMetaEditor} edit={edit} />;
  },

  cta: (block, _meta, _onUpdateBlock, _onOpenMetaEditor, edit) => {
    if (block.type !== "cta") return {} as JSX.Element;
    return <CtaBlock {...block.data} edit={edit} />;
  },
};

export default function BlockRenderer(props: Props) {
  
  const { meta, block, edit, onUpdateBlock, onOpenMetaEditor } = props;
  const render = blockRegistry[block.type];

  if (!render) return null;

  const handleUpdateFields = (updatedData: Record<string, any>) => {
    if (block.id) {
      onUpdateBlock(block.id, updatedData);
    }
  };

  const content = render(block as any, meta, handleUpdateFields, onOpenMetaEditor, edit);

  return <div>{content}</div>;
}
