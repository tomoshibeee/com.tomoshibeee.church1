"use client";

export function AddSiteButton() {
  return (
    <button
      className="flex flex-col items-center justify-center min-h-[120px] rounded-lg border-2 border-dashed border-gray-300 bg-white p-5 text-gray-500 transition hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
      onClick={() => {
        alert("新しいサイトを追加する処理を実装してください。");
      }}
    >
      <span className="text-2xl font-light mb-1">+</span>
      <span className="text-sm font-semibold">Add New Site</span>
    </button>
  );
}
