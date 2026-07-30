export type { HeroBlockData, HeroBlockType } from "./hero/types";
export type { GreetingBlockData, GreetingBlockType } from "./greeting/types";
export type { ServiceBlockData, ServiceBlockType } from "./service/types";
export type { NewsBlockData, NewsBlockType } from "./news/types";
export type { AccessBlockData, AccessBlockType } from "./access/types";
export type { CtaBlockData, CtaBlockType } from "./cta/types";
export type { ContactBlockData, ContactBlockType } from "./contact/types";

import type { HeroBlockType, HeroBlockData } from "./hero/types";
import type { GreetingBlockType, GreetingBlockData } from "./greeting/types";
import type { ServiceBlockType, ServiceBlockData } from "./service/types";
import type { NewsBlockType, NewsBlockData } from "./news/types";
import type { AccessBlockType, AccessBlockData } from "./access/types";
import type { CtaBlockType, CtaBlockData } from "./cta/types";
import type { ContactBlockType, ContactBlockData } from "./contact/types";

export type Block =
  | HeroBlockType
  | GreetingBlockType
  | ServiceBlockType
  | NewsBlockType
  | AccessBlockType
  | CtaBlockType
  | ContactBlockType;

export type BlockData =
  | HeroBlockData
  | GreetingBlockData
  | ServiceBlockData    
  | NewsBlockData
  | AccessBlockData
  | CtaBlockData
  | ContactBlockData
  | Record<string, any>;