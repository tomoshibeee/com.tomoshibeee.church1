import { SectionData } from "@/features/section/types";
import { MetaData } from "./site-meta";
import { MenuItem } from "./site-menu";
import { SiteSocialLink } from "@/models/site-social-link";

export type SiteData = {
  meta: MetaData;
  navigation?: {
    menu?: MenuItem[];
  };
  layout: {
    sections: SectionData[];
  };
  socialLinks?: SiteSocialLink[];
};
