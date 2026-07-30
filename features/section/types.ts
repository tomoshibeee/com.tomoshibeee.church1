import { Block } from "@/features/block";
import { SectionType } from "@/models/site-section";

export type SectionData = {
  anchorId?: string;
};

export type Section = {
  id: string;
  type: SectionType;
  data?: SectionData;
  blocks: Block[];
};