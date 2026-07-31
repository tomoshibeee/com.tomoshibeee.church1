import Link from "next/link";

export function SignupButton() {
  return (
    <Link
      href="/signup"
      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
    >
      新規登録
    </Link>
  );
}
