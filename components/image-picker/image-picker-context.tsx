// src/components/features/image-picker/image-picker-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ImagePickerModal } from "./image-picker-modal";

type ImagePickerContextType = {
  openPicker: (onSelect: (url: string) => void) => void;
};

const ImagePickerContext = createContext<ImagePickerContextType | undefined>(
  undefined,
);

export function ImagePickerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState<(url: string) => void>(() => {});

  // 💡 【ここを追加！】isOpen の変化を24時間監視するログ
  useEffect(() => {
    console.log("🚨 現在の isOpen の値は:", isOpen);
  }, [isOpen]);

  const openPicker = (onSelect: (url: string) => void) => {
    console.log("⚡ openPickerが実行されました!"); // 💡 これも入れておくと安心
    setCallback(() => onSelect);
    setIsOpen(true);
  };

  return (
    <ImagePickerContext.Provider value={{ openPicker }}>
      {children}
      <ImagePickerModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={(url) => {
          callback(url);
        }}
      />
    </ImagePickerContext.Provider>
  );
}

export function useImagePicker() {
  const context = useContext(ImagePickerContext);
  if (!context) {
    throw new Error(
      "useImagePicker must be used within an ImagePickerProvider",
    );
  }
  return context;
}
