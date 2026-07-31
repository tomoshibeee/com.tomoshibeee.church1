import Link from "next/link";

type Props = {
  i: number;
  label: string;
  handleLogout: () => void;
};

export function LogoutButton(props: Props) {
  const { i, label, handleLogout } = props;
  return (
    <div key={`${i}-${label}`} className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm font-bold text-red-600 py-1 hover:text-red-700 text-left cursor-pointer"
      >
        {label}
      </button>
    </div>
  );
}
