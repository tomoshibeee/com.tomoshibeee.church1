export type ServiceBlockData = {
  items: {
    id: string;
    title: string;
    time: string;
    location: string;
    link?: string;
    comment?: string;
  }[];
};

export type ServiceBlockType = {
  id?: string;
  type: "service";
  variant?: "default";
  data: ServiceBlockData;
};
