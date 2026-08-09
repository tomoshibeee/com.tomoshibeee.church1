import { BlockData } from "@/features/block/index";
import { BlockType } from "@/models/master-block";

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

