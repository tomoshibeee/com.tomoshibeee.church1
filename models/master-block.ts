import { BlockData } from "@/features/block/index";

// m_blocks テーブルの1レコードを表す型
export type MasterBlock = {
    id: string;
    type: BlockType;
    name: string;
    description: string | null;
    category: string;
    icon: string | null;
    default_variant: string | null;
    default_data: BlockData | null;
    enabled: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
};

// 新規作成時（IDやタイムスタンプ自動生成前）の型
export type CreateMasterBlockInput = Omit<
    MasterBlock,
    "id" | "created_at" | "updated_at"
>;

export type BlockType = "hero" | "products" | "site_news" | "about" | "service" | "access" | "contact";
