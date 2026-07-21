"use client";

import { useEffect, useState } from "react";

/** حدس ساده‌ی زبان بر اساس اسکریپت متن (برای انتخاب صدای مناسب). */
function guessLang(text: string): string {
  if (/[؀-ۿ]/.test(text)) return "fa-IR";
  return "en-US";
}

export default function SpeakButton({
  text,
  label,
  variant = "chip",
}: {
  text: string;
  /** برچسب متنی (فقط در حالت chip). */
  label?: string;
  variant?: "chip" | "icon";
}) {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" && "speechSynthesis" in window,
    );
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleClick() {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    // هر صدای در حال پخش را متوقف کن (این دکمه یا دکمه‌ی دیگر).
    const wasThisSpeaking = speaking;
    synth.cancel();
    setSpeaking(false);
    if (wasThisSpeaking) return; // کلیک دوباره روی همین دکمه = توقف

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = guessLang(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  }

  if (!supported) {
    return (
      <span
        title="مرورگر شما از پخش صوت پشتیبانی نمی‌کند"
        className="text-[11px] text-slate-300"
      >
        {variant === "icon" ? "🔇" : "🔇 صوت در دسترس نیست"}
      </span>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={speaking ? "توقف پخش" : "پخش صوت"}
        title={speaking ? "توقف" : "پخش صوت"}
        className={
          "shrink-0 rounded-md px-1.5 py-1 text-sm transition " +
          (speaking
            ? "bg-brand-100 text-brand-700"
            : "text-slate-400 hover:bg-slate-100 hover:text-brand-600")
        }
      >
        {speaking ? "⏹" : "🔊"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition " +
        (speaking
          ? "border-brand-300 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50")
      }
    >
      {speaking ? "⏹ توقف" : `🔊 ${label ?? "پخش صوت"}`}
    </button>
  );
}
