"use client";

import { useEffect, useState } from "react";

type Props = {
  email: string;
  submitLabel: string;
};

export default function ContactForm({ email, submitLabel }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return <div className="min-h-[398px] rounded-lg bg-white p-6 shadow-md" />;
  }

  return (
    <form
      action={`mailto:${email}`}
      method="post"
      encType="text/plain"
      autoComplete="off"
      className="grid gap-4 rounded-lg bg-white p-6 shadow-md"
    >
      <div className="grid gap-2">
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-gray-700"
        >
          お名前
        </label>
        <input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          className="rounded-md border border-gray-300 px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="山田 太郎"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-gray-700"
        >
          メールアドレス
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-gray-300 px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-gray-700"
        >
          お問い合わせ内容
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="resize-y rounded-md border border-gray-300 px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="ご質問やご相談内容をご記入ください"
        ></textarea>
      </div>

      <button
        type="submit"
        className="mt-2 rounded-md bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
