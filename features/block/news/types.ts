export type NewsBlockData = {
  items: NewsItem[];
};

export type NewsBlockType = {
  id?: string;
  type: "news";
  variant?: "default";
  data: NewsBlockData;
};

export type NewsItem = {
  id: string,
  title: string;
  content?: string;
  eventDate: string;
  publishedAt: string;
  doc?: string;
  youtube?: string;
};