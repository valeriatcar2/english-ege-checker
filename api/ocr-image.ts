import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 50000,
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

    if (imageBase64.length < 100) {
      return new Response(JSON.stringify({ error: "Image is empty or too small" }), {
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
              text: "Transcribe all handwritten text from this image exactly as written. Output only the text.",
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
    const message = err instanceof Error ? err.message : String(err);
    console.error("OCR error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
