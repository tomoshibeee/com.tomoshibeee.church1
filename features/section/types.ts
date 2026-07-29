import { Block } from "@/features/block";
import { SectionType } from "@/models/site-section";

export type SectionData = {
  id: string;
  type: SectionType;
  anchorId?: string;
  blocks: Block[];
};