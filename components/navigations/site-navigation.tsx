"use client";

import { useState } from "react";
import Template from "@/components/templates/template";
import { SiteData } from "@/types/site";
import { ImagePickerProvider } from "@/components/image-picker";

type Props = { site: SiteData };

export default function SiteNavigation({ site: initialSite }: Props) {
  const [site, setSite] = useState<SiteData>(initialSite);

  return (
    <ImagePickerProvider>
      {/* 💡 site をそのまま流し込むだけでOK。Templateの中で展開する必要もなくなります */}
      <Template
        site={site}
        edit
        newsItems={[]}
      />
    </ImagePickerProvider>
  );
}