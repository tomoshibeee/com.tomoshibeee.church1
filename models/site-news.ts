export type SiteNews = {
  id: string;
  site_id: string;

  title: string;
  content: string | null;

  event_date: string;
  published_at: string;

  doc: string | null;
  youtube: string | null;

  created_at: string;
  updated_at: string;
};
