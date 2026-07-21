// app/dashboard/new/page.tsx
"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

export default function NewSitePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const router = useRouter();

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl mb-4">Create New Site</h1>

      <div className="flex flex-col gap-4 max-w-md">
        <input
          className="border p-2 rounded"
          placeholder="Site name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="slug (example: my-site)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <button
          className="bg-black text-white p-2 rounded"
          onClick={() => {
            router.push("/dashboard");
            // alert(`name: ${name}, slug: ${slug}`);
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}
