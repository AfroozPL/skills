import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { sampleLesson } from "@/lib/sample-lesson";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/types";

// شناسه‌ی «sample» همان درس نمونه‌ی مرحله ۱ را نشان می‌دهد؛
// بقیه از Supabase خوانده می‌شوند.
async function getLesson(id: string): Promise<Lesson | null> {
  if (id === "sample") return sampleLesson;

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("lessons")
      .select("id, title, content")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    const content = data.content as {
      keyPoints: string[];
      terms: Lesson["terms"];
    };
    return {
      id: data.id,
      title: data.title,
      keyPoints: content.keyPoints,
      terms: content.terms,
    };
  } catch (err) {
    console.error("خواندن درس از دیتابیس ناموفق بود:", err);
    return null;
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await getLesson(id);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
