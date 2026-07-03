"use client";

import { useState } from "react";

import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { Block } from "@/features/block/index";
import { ImageDrawer } from "@/features/drawer/image-drawer/image-drawer";

type Props = {
  site: SiteData;
};

export default function EditPageContainer(props: Props) {
  const { site } = props;

  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [sections, setSections] = useState(site.layout.sections);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Template
        site={{
          ...site,
          layout: { ...site.layout, sections: sections },
        }}
        edit
        onOpenImageUploader={() => setIsDrawerOpen(true)}
        newsItems={[]}
      />

      <ImageDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpload={(url) => {
          alert(`${url}を保存?`);
        }}
      />
    </>
  );
}
