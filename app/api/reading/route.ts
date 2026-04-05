import { NextRequest } from "next/server";
import OpenAI from "openai";
import { buildReadingPrompt } from "@/lib/prompt";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "API 키가 설정되지 않았습니다" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { question, spread, cards } = body as {
    question: string;
    spread: string;
    cards: { position: string; name: string; reversed: boolean }[];
  };

  const prompt = buildReadingPrompt({
    spreadName: spread,
    question: question || "",
    cards,
  });

  const openai = new OpenAI({ apiKey });

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch {
          controller.enqueue(encoder.encode("\n\n해석이 중단되었습니다."));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError && error.status === 429) {
      return Response.json(
        {
          error:
            "일시적으로 해석 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.",
        },
        { status: 429 }
      );
    }
    return Response.json(
      { error: "해석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
