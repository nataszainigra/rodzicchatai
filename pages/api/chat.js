import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Nagłówki CORS — pozwól na wywołania z Twojej domeny frontendowej
  res.setHeader("Access-Control-Allow-Origin", "https://www.rodzic.ai"); // dostosuj do swojej domeny
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Obsługa preflight
    return res.status(200).end();
  }

  console.log("Metoda:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, age, gender, context, messages } = req.body;

    console.log("Req body:", req.body); // <-- log tutaj

  let chatMessages;

  if (messages && Array.isArray(messages)) {
    chatMessages = messages;
  } else if (question) {
    chatMessages = [
      {
        role: "system",
        content: "Jesteś pomocnym doradcą dla rodziców.",
      },
      {
        role: "user",
        content: `Dane dziecka:
- Wiek: ${age || "nieznany"}
- Płeć: ${gender || "nieznana"}
- Kontekst: ${context || "brak"}

Pytanie: ${question}
Odpowiedz dokładnie i rzeczowo.`,
      },
    ];
  } else {
    return res.status(400).json({ error: "No valid question or messages provided" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content.trim();

    res.status(200).json({ answer });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "OpenAI API error" });
  }
}
