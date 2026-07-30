import { BlockData } from "@/features/block/index";

export type SiteBlock = {
    id: string;
    section_id: string;
    type: BlockType;
    variant: string;
    data: BlockData | null;
    display_order: number;
    created_at: string;
    updated_at: string;
};

export type BlockType = "hero" | "products" | "site_news" | "about" | "service" | "access" | "contact";
