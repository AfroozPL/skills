"use client";

import { useState } from "react";

export default function ShareLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // اگر clipboard در دسترس نبود، کاری نمی‌کنیم.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
    >
      {copied ? "✓ لینک کپی شد" : "🔗 کپی لینک برای دانشجو"}
    </button>
  );
}
