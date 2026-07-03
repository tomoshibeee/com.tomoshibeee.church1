import { randomUUID } from "crypto";
import { SiteSection, SectionType } from "@/models/site-section";

import {dummySites} from "@/lib/data";

export function dummySiteSectionModelData(siteIds: string[]): SiteSection[] {
    const now = new Date().toISOString();

    const sectionList = dummySites;
    
    return sectionList.flatMap((siteJson, siteIndex) => {
        const siteId = siteIds[siteIndex];

        return siteJson.layout.sections.map((s, i) => ({
            id: randomUUID(),
            site_id: siteId, 
            type: s.type as SectionType,
            display_order: i,
            created_at: now,
            updated_at: now,
        }));
    });
}