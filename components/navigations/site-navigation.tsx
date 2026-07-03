// src/app/dashboard/edit-page-container.tsx（※実際のパスに合わせてください）
"use client";

import { useState } from "react";
import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { ImagePickerProvider } from "@/components/image-picker";

type Props = { site: SiteData };

export default function SiteNavigation({ site }: Props) {
  const [sections, setSections] = useState(site.layout.sections);

  return (
    // 💡 必ずこのファイルの一番大元で包んで、下の Template に電波を届けます
    <ImagePickerProvider>
      <Template
        site={{
          ...site,
          layout: { ...site.layout, sections: sections },
        }}
        edit
        newsItems={[]}
      />
    </ImagePickerProvider>
  );
}