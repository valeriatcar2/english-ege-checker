import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { prompt, studentText } = body;

    if (!prompt || !studentText) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: "You are a strict EGE English writing examiner."
        },
        {
          role: "user",
          content: `${prompt}\n\nSTUDENT ANSWER:\n${studentText}`
        }
      ]
    });

    return res.status(200).json({ output: response.output_text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to evaluate writing" });
  }
}