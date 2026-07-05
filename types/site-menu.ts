export type MenuItem = {
  // id : string, // TODO : ID作るか?
  label: string;
  href?: string;
  icon?: string;
  type?: "link" | "news" | "logout" | "menu-editor"; // 💡 新しいタイプを追加
  children?: MenuItem[];
  onClick?: () => void; // 💡 メニューアイテムがクリックされたときのコールバック関数を追加
};