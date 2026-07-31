import Link from "next/link";

export function LoginButton() {
      return (
    <Link
      href="/login"
      className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
    >
      ログイン
    </Link>
  );
}
