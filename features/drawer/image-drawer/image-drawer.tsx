"use client";

import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCloud, FaGoogleDrive } from "react-icons/fa6"; // アイコンを追加してさらに洗練

import { CloudinaryTab } from "./cloudinary-tab";
import { GoogleDriveTab } from "./google-drive-tab";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: (url: string) => void;
};

export function ImageDrawer(props: Props) {
  const { open, onClose, onUpload } = props;

  // ドロワーの背景を bg-slate-100 からデザインに合わせた「白（bg-white）」ベースに変更
  const baseDrawerClass =
    "fixed bottom-0 left-0 w-full rounded-t-2xl max-h-[85vh] overflow-y-auto bg-white shadow-2xl transform transition-transform duration-300 z-50 block pb-10";
  const drawerClass = open
    ? `${baseDrawerClass} translate-y-0`
    : `${baseDrawerClass} translate-y-full`;

  const baseOverlayClass = "fixed inset-0 bg-black/40 z-40";
  const overlayClass = open
    ? `${baseOverlayClass} transition-opacity duration-300 opacity-100 block`
    : `${baseOverlayClass} transition-opacity duration-300 opacity-0 hidden`;

  const [activeTab, setActiveTab] = useState<"cloudinary" | "gdrive">(
    "cloudinary",
  );

  const handleSelect = (url: string) => {
    // 選択時に親コンポーネントへURLを渡し、ドロワーを閉じる
    onUpload(url);
    onClose();
  };

  return (
    <>
      <div className={overlayClass} onClick={onClose} />

      <div className={drawerClass}>
        {/* 閉じるボタン：デザインの右側ボタンを参考に、スッキリした丸型ホバーに調整 */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 absolute top-4 right-4 z-50 cursor-pointer transition text-2xl"
          onClick={onClose}
          aria-label="閉じる"
        >
          <IoIosCloseCircleOutline />
        </button>

        {/* 
          ここからがデザインを取り入れたメインセクション 
          レスポンシブで、スマホでは縦積み、PC（md:）では左にタブ・右に中身の2カラムになります
        */}
        <section className="grid gap-6 p-6 max-w-5xl mx-auto pt-16 md:grid-cols-[180px_1fr]">
          {/* 左カラム：タブ選択エリア（参考デザインの「日付・時間」エリアの構造をベースに構築） */}
          <div className="flex flex-row gap-2 text-sm font-semibold md:flex-col md:items-start md:gap-3">
            <button
              onClick={() => setActiveTab("cloudinary")}
              className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-md transition ${
                activeTab === "cloudinary"
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <FaCloud className="text-base shrink-0" />
              <span>Cloudinary</span>
            </button>

            <button
              onClick={() => setActiveTab("gdrive")}
              className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-md transition ${
                activeTab === "gdrive"
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <FaGoogleDrive className="text-base shrink-0" />
              <span>Google Drive</span>
            </button>
          </div>

          {/* 右カラム：中身切り替えエリア（参考デザインの「メインコンテンツ」エリア） */}
          <div className="min-w-0 border-t pt-5 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-gray-100">
            {/*<h3 className="text-lg font-bold text-gray-900 mb-4">
              {activeTab === "cloudinary" ? "Cloudinary から画像を選択" : "Google Drive から画像を選択"}
            </h3>*/}

            {/* 各タブのコンポーネントを配置 */}
            <div className="text-gray-600">
              {activeTab === "cloudinary" && (
                <CloudinaryTab onSelect={handleSelect} />
              )}

              {activeTab === "gdrive" && (
                <GoogleDriveTab onSelect={handleSelect} />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
