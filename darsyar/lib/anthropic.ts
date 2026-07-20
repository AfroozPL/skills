import Anthropic from "@anthropic-ai/sdk";
import type { GeneratedLesson } from "./types";
import { validateGeneratedLesson } from "./validate";

// JSON Schema برای structured outputs. توجه: محدودیت‌های شمارشی آرایه
// (مثل «دقیقاً ۳ مثال») در schema پشتیبانی نمی‌شوند و در validate.ts چک می‌شوند.
const LESSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    keyPoints: { type: "array", items: { type: "string" } },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string" },
          meaning: { type: "string" },
          examples: { type: "array", items: { type: "string" } },
          quiz: {
            type: "object",
            properties: {
              q: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              answer: { type: "integer" },
            },
            required: ["q", "options", "answer"],
            additionalProperties: false,
          },
        },
        required: ["term", "meaning", "examples", "quiz"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "keyPoints", "terms"],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `تو یک دستیار آموزشی برای معلم‌های زبان هستی. متن جزوه‌ی یک جلسه را می‌گیری و آن را به یک درس تعاملی ساختاریافته تبدیل می‌کنی.

قواعد خروجی:
- یک "title" کوتاه و گویا برای درس بساز (به فارسی).
- "keyPoints": بین ۳ تا ۵ نکته‌ی کلیدیِ جلسه، به فارسی و خوانا.
- "terms": فهرست مهم‌ترین اصطلاح‌ها/واژه‌های جلسه (بین ۳ تا ۸ مورد). برای هر اصطلاح:
  - "term": خودِ اصطلاح، به همان زبانی که در جزوه آموزش داده می‌شود (مثلاً انگلیسی).
  - "meaning": معنی/توضیح کوتاه به فارسی.
  - "examples": دقیقاً ۳ جمله‌ی مثال در سه موقعیت متفاوت، به زبان مقصد (همان زبان اصطلاح).
  - "quiz": یک تمرین چهارگزینه‌ای:
    - "q": صورت سؤال به فارسی.
    - "options": دقیقاً ۴ گزینه.
    - "answer": ایندکس گزینه‌ی درست به‌صورت عدد صحیح ۰ تا ۳ (۰ یعنی گزینه‌ی اول).
- فقط بر اساس محتوای جزوه بساز؛ چیزی از خودت اضافه نکن که با متن بی‌ارتباط باشد.`;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "کلید ANTHROPIC_API_KEY تنظیم نشده است. آن را در فایل .env.local قرار دهید.",
    );
  }
  return new Anthropic({ apiKey });
}

async function attemptGenerate(
  client: Anthropic,
  lessonText: string,
): Promise<GeneratedLesson> {
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    output_config: { format: { type: "json_schema", schema: LESSON_SCHEMA } },
    messages: [{ role: "user", content: lessonText }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("پاسخ مدل حاوی متن نبود");
  }

  // ممکن است JSON خراب باشد؛ JSON.parse خطا می‌دهد و بالادست retry می‌کند.
  const parsed = JSON.parse(textBlock.text);
  return validateGeneratedLesson(parsed);
}

/**
 * متن جزوه را به درس ساختاریافته تبدیل می‌کند.
 * اگر خروجی (JSON خراب یا اعتبارسنجی ناموفق) مشکل داشت، یک بار دیگر تلاش می‌کند.
 */
export async function generateLesson(
  lessonText: string,
): Promise<GeneratedLesson> {
  const client = getClient();
  try {
    return await attemptGenerate(client, lessonText);
  } catch (firstError) {
    console.warn("تلاش اول تولید درس ناموفق بود، retry:", firstError);
    // یک retry طبق درخواست مرحله ۲
    return await attemptGenerate(client, lessonText);
  }
}
