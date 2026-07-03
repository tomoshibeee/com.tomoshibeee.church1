"use client";

import { useState } from "react";
import { FaGoogleDrive, FaSpinner } from "react-icons/fa6";

type Props = {
  onSelect: (url: string) => void;
};

// Googleコンソールで発行する認証情報（実際の実装時に環境変数などから入れてください）
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "YOUR_API_KEY";

export function GoogleDriveTab(props: Props) {
  const { onSelect } = props;
  const [isConnecting, setIsConnecting] = useState(false);

  // Google Pickerを起動する処理
  const handleOpenPicker = async () => {
    setIsConnecting(true);

    try {
      // 💡 開発を楽にするためのステップ（処理の流れ）
      // 1. Google Identity Services (GIS) でユーザーのアクセストークンを取得
      // 2. トークンを使って gapi.client.picker.PickerBuilder をビルド
      // 3. 画像（MimeType: image/*）だけを表示するフィルターをかけてポップアップ表示

      // --- 【以下は実際のAPI発火時のイメージコード】 ---
      // ※実際の実装時は公式スクリプトをロードするか、ラッパーライブラリを使用します
      // const token = await getGoogleAccessToken(CLIENT_ID);
      // openGooglePicker({
      //   apiKey: API_KEY,
      //   token: token,
      //   viewId: "DOCS_IMAGES", // 画像のみに絞り込む設定
      //   callback: (data) => {
      //     if (data.action === "picked") {
      //       const file = data.docs[0];
      //       // Google Driveの直リンクURLまたは埋め込み用URLを親に渡す
      //       const viewUrl = file.url;
      //       onSelect(viewUrl);
      //     }
      //   }
      // });
      // ----------------------------------------------

      // デモ用に2秒後にURLを返すシミュレーション（実装時は削除してください）
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // ※実際は選ばれた画像のURLが入ります
      onSelect("https://lh3.googleusercontent.com/d/demo_image_id");
    } catch (error) {
      console.error("Google Drive connection failed:", error);
      alert("Google Driveとの連携に失敗しました。");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="w-full">
      {/* 
        CloudinaryTabと対になる美しいダッシュ枠デザイン
        Googleのブランドカラーである「グリーン」をベースにしています
      */}
      <div
        onClick={handleOpenPicker}
        className={`group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition cursor-pointer
          ${
            isConnecting
              ? "border-green-300 bg-green-50/30 cursor-not-allowed"
              : "border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50/50 hover:shadow-sm"
          }`}
      >
        {isConnecting ? (
          // 接続中のローディング表示
          <div className="flex flex-col items-center gap-3">
            <FaSpinner className="h-10 w-10 animate-spin text-green-600" />
            <p className="text-sm font-semibold text-green-600">
              Google Drive に接続中...
            </p>
          </div>
        ) : (
          // 通常時の表示
          <div className="flex flex-col items-center">
            {/* アイコン枠：ホバーで緑に染まるインタラクション */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition duration-200">
              <FaGoogleDrive className="text-xl" />
            </div>

            <h4 className="text-base font-bold text-gray-900 mb-1">
              Google Drive から画像を選択
            </h4>

            <p className="text-xs text-gray-500 leading-5 max-w-sm">
              クリックしてGoogleアカウントと安全に連携し、
              <br />
              マイドライブや共有ドライブから画像を選択します。
            </p>
            <p className="mt-2 text-2xs text-gray-400">
              ※選択した画像はWebサイト上で公開可能な状態になります
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
