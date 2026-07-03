"use client";

import { useState, useCallback } from "react";

/**
 * 画像ピッカーをコントロールするためのカスタムフック
 * @param onPickSuccess 画像が最終的に選択されたときに実行したい処理
 */
export function useImagePicker(onPickSuccess: (url: string) => void) {
  const [isOpen, setIsOpen] = useState(false);

  const openPicker = useCallback(() => setIsOpen(true), []);
  const closePicker = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    openPicker,
    closePicker,
    // モーダルコンポーネントにそのまま {...pickerProps} で渡せるオブジェクト
    pickerProps: {
      open: isOpen,
      onClose: closePicker,
      onSelect: onPickSuccess,
    },
  };
}