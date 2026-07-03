export type MenuItem = {
  // id : string, // TODO : ID作るか?
  label: string;
  href?: string;
  icon?: string;
  type?: "link" | "news" | "logout";
  children?: MenuItem[];
};