"use client";

import { useState } from "react";

import Template from "@/components/templates/template";
import { ImagePickerModal, useImagePicker } from "@/components/image-picker";
import { SiteData } from "@/types/site";
import { Block } from "@/features/block/index";

type Props = {
  site: SiteData;
};

export default function EditPageContainer(props: Props) {
  const { site } = props;

  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [sections, setSections] = useState(site.layout.sections);

  // 💡 開閉状態やコールバックのゴチャついたロジックをすべてフックにカプセル化
  const { openPicker, pickerProps } = useImagePicker((url) => {
    // 画像が選ばれたときの処理（ここに必要な保存ロジックを書く）
    alert(`${url}を保存?`);
  });

  return (
    <>
      <Template
        site={{
          ...site,
          layout: { ...site.layout, sections: sections },
        }}
        edit
        // 💡 状態変更関数を直接渡すのではなく、フックから提供される関数を呼ぶだけ
        onOpenImageUploader={openPicker}
        newsItems={[]}
      />

      {/* 💡 {...pickerProps} で open, onClose, onSelect を一括展開してスッキリ */}
      <ImagePickerModal {...pickerProps} />
    </>
  );
}