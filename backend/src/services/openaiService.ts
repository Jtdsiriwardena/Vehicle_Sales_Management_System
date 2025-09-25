import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

const OPENAI_KEY = process.env.OPENAI_API_KEY;


export async function generateDescription(vehicle: {
    brand: string;
    model: string;
    year?: number;
    type?: string;
    color?: string;
    engineSize?: string;
}) {
    interface OpenAIChatResponse {
        choices: {
            message: { role: string; content: string };
        }[];
    }

    // Basic prompt
    const prompt = `Write an engaging, short sales description (2-4 sentences) for a ${vehicle.year ?? ""} ${vehicle.brand} ${vehicle.model} ${vehicle.type ?? ""}. Mention color: ${vehicle.color ?? "N/A"} and engine: ${vehicle.engineSize ?? "N/A"}. Keep tone persuasive and friendly.`;

    if (!OPENAI_KEY) {
        // fallback
        return `A ${vehicle.brand} ${vehicle.model} (${vehicle.year ?? "Year N/A"}) with ${vehicle.engineSize ?? "engine N/A"} — a reliable choice for everyday driving.`;
    }


    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
            temperature: 0.7,
        }),
    });

    const data = (await resp.json()) as OpenAIChatResponse;
    const text = data.choices?.[0]?.message?.content;
    return text ?? prompt;

}
