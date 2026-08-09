import { supabase } from "@/lib/supabase";
import { MasterBlock } from "@/models/master-block";

/**
 * 有効なマスターブロック一覧を取得する（表示順）
 */
export async function getMasterBlocks(): Promise<MasterBlock[]> {
    const { data, error } = await supabase
        .from("m_blocks")
        .select("*")
        .eq("enabled", true)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Failed to fetch master blocks:", error);
        throw new Error(error.message);
    }

    return data as MasterBlock[];
}

/**
 * カテゴリー別にグループ化したマスターブロックを取得する
 */
export async function getMasterBlocksByCategory(): Promise<Record<string, MasterBlock[]>> {
    const blocks = await getMasterBlocks();

    return blocks.reduce((acc, block) => {
        const category = block.category || "general";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(block);
        return acc;
    }, {} as Record<string, MasterBlock[]>);
}

/**
 * 特定の type のマスターブロックを取得する
 */
export async function getMasterBlockByType(
    type: string
): Promise<MasterBlock | null> {

    const { data, error } = await supabase
        .from("m_blocks")
        .select("*")
        .eq("type", type)
        .eq("enabled", true)
        .single();

    if (error) {
        console.error(`Failed to fetch master block for type [${type}]:`, error.message);
        return null;
    }

    return data as MasterBlock;
}