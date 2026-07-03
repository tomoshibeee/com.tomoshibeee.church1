export type SiteSection = {
    id: string;
    site_id: string;
    type: SectionType;
    display_order: number;
    created_at: string;
    updated_at: string;
};

export type SectionType = 
    "hero" | 
    "products" | 
    "site_news" | 
    "global_news" | 
    "about" | 
    "service" | 
    "access" | 
    "contact";
