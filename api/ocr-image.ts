import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return new Response(JSON.stringify({ error: "Missing imageBase64 or mimeType" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "This is a photo of a handwritten English essay or letter by a student. Please extract ALL the text exactly as written, preserving every word, line break, and paragraph. Do not correct spelling or grammar errors — transcribe exactly what is written. Output only the extracted text, nothing else.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    });

    const extractedText = response.choices[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ text: extractedText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("OCR error:", err);
    return new Response(JSON.stringify({ error: "Failed to process image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
