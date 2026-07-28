export type GreetingBlockData = {
  name: string;
  role?: string;
  image: string;
  bio?: string;
  message?: string;
};

export type GreetingBlockType = {
  id?: string;
  type: "greeting";
  variant?: "default";
  data: GreetingBlockData;
};
