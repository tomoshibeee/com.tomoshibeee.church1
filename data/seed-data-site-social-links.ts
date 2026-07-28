import { randomUUID } from "crypto";
import { dummySiteSocialAccountLists } from "@/lib/data";
export function dummySiteSocialLinkModelData(siteIds: string[]) {
    const now = new Date().toISOString();

    return dummySiteSocialAccountLists.flatMap((s, i) => {
        return s.map((a) => {
            return {
                id: randomUUID(),
                site_id: siteIds[i],
                type_id: a.type, // ←これも修正🔥
                url: a.url,
                display_order: a.priority,
                created_at: now,
                updated_at: now,
            };
        });
    });;
}