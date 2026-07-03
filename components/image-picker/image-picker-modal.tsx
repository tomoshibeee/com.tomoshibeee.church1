"use client";

import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FaCloud, FaGoogleDrive } from "react-icons/fa6";

import { CloudinaryTab } from "./cloudinary-tab";
import { GoogleDriveTab } from "./google-drive-tab";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

type TabType = "cloudinary" | "gdrive";

export function ImagePickerModal({ open, onClose, onSelect }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("cloudinary");

  if (!open) return null;

  // タブ内で画像が選ばれたら、そのまま親のコールバックを発火してモーダルを閉じる
  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  return (
    <>
      {/* 背景オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* モーダル本体：PCでは中央大きな枠、スマホでは画面いっぱいに広がる */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl md:h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-scale-in">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-800">画像を選択</h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition text-2xl cursor-pointer"
            onClick={onClose}
            aria-label="閉じる"
          >
            <IoIosClose />
          </button>
        </div>

        {/* メインエリア */}
        <div className="flex-1 overflow-hidden grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[200px_1fr]">
          {/* 左サイドバー（タブメニュー） */}
          <div className="flex flex-row md:flex-col gap-2 p-4 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100 shrink-0 overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActiveTab("cloudinary")}
              className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === "cloudinary"
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FaCloud className="text-base shrink-0" />
              <span>Cloudinary</span>
            </button>

            <button
              onClick={() => setActiveTab("gdrive")}
              className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === "gdrive"
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FaGoogleDrive className="text-base shrink-0" />
              <span>Google Drive</span>
            </button>
          </div>

          {/* 右コンテンツ（選択画面の中身） */}
          <div className="p-6 overflow-y-auto min-w-0">
            {activeTab === "cloudinary" && (
              <CloudinaryTab onSelect={handleSelect} />
            )}
            {activeTab === "gdrive" && (
              <GoogleDriveTab onSelect={handleSelect} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
