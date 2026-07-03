import { HeroBlockData } from "@/features/block";

type Props = {
  data: HeroBlockData;
  onChange: (data: HeroBlockData) => void;
};

export default function HeroForm({ data, onChange }: Props) {
  return (
    <input
      value={data.title ?? ""}
      onChange={(e) => {
        onChange({
          ...data,
          title: e.target.value,
        });
      }}
    />
  );
}