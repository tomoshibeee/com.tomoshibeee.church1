export type ContactBlockData = {
  title?: string;
  description?: string;
  submitLabel?: string;
};

export type ContactBlockType = {
  id?: string;
  type: "contact";
  variant?: "default";
  data: ContactBlockData;
};
