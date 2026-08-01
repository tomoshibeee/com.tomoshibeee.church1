import { Section } from "@/features/section/types";
import { MetaData } from "./site-meta";
import { MenuItem } from "./site-menu";
import { SiteSocialLink } from "@/models/site-social-link";

export type SiteMode = "view" | "edit" | "preview";

export type SiteData = {
  meta: MetaData;
  navigation?: {
    menu?: MenuItem[];
  };
  layout: {
    sections: Section[];
  };
  socialLinks?: SiteSocialLink[];
};
