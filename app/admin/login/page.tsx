"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin/products";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      setErr(j?.error || "로그인 실패");
      return;
    }

    router.replace(next);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded-2xl p-6 bg-white">
        <h1 className="text-xl font-bold mb-4">관리자 로그인</h1>
        <label className="text-sm text-gray-600">비밀번호</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-1" placeholder="관리자 비밀번호" />
        {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
        <button className="w-full mt-4 bg-black text-white rounded-xl py-2">접속</button>
      </form>
    </div>
  );
}
