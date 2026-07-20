import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { sampleLesson } from "@/lib/sample-lesson";
import type { Lesson } from "@/lib/types";

// مرحله ۱: فقط درس نمونه را می‌شناسیم. در مرحله ۲ این تابع از Supabase می‌خواند.
async function getLesson(id: string): Promise<Lesson | null> {
  if (id === "sample") return sampleLesson;
  return null;
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
