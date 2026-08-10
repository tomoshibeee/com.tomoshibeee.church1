type Props = {
  handleLogout: () => void;
};

export function LogoutButton(props: Props) {
  const { handleLogout } = props;
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-1 bg-slate-800 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border border-slate-700/60 hover:border-rose-800/50 cursor-pointer"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>ログアウト</span>
    </button>
  );
}
