export type SiteBlock = {
    id: string;     
    section_id: string;
    type: BlockType;
    variant: string;
    data: object;
    display_order: number;
    created_at: string;
    updated_at: string;
};

export type BlockType = "hero" | "products" | "site_news" | "about" | "service" | "access" | "contact";
