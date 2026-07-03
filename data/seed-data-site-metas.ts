import { randomUUID } from "crypto";
import { SiteMeta } from "../models/site-meta";

import { dummySiteMetas } from "@/lib/data";

export function dummySiteMetaModelData(siteIds: string[]) {
    const now = new Date().toISOString();
    const metas =
        dummySiteMetas.map((m, i) => {
            return {
                id: randomUUID(),
                site_id: siteIds[i],
                slug: m.slug,
                name: m.name,
                tel: m.tel,
                email: m.email,
                postal_code: m.postalCode,
                address: m.address,
                building: m.bldg,
                access: m.access,
                description: m.description,
                background_image: m.background_image,
                avatar: m.avatar,
                created_at: now,
                updated_at: now,
            } as SiteMeta;
        });
    return siteIds.map((siteId, i) => {
        return {
            ...metas[i % dummySiteMetas.length],
            site_id: siteId
        };
    }) as SiteMeta[];
}