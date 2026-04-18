import { NextResponse } from 'next/server';
import { IdeaState } from '@/store/useProjectStore';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { state, targetField } = await req.json() as { state: IdeaState, targetField: string };

    if (!state || !targetField) {
      return NextResponse.json({ error: 'State and targetField are required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Groq API Key." }, { status: 500 });
    }

    const systemPrompt = `You are a Senior Software Architect expert.
Your job is to generate a professional, high-fidelity suggestion for a specific section of a project blueprint based on the existing context.

TARGET SECTION: ${targetField}

CURRENT PROJECT CONTEXT:
${JSON.stringify(state, null, 2)}

INSTRUCTIONS:
1. Generate ONLY the content for the ${targetField} section.
2. Be technical, precise, and professional.
3. If it's Architecture, describe the high-level pattern and components.
4. If it's Database, describe entities and relationships.
5. If it's API, define core endpoints.
6. If it's Security, define auth, encryption, and protection measures.
7. Output must be clean text (or markdown list) with NO introductory or concluding text.`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.5
      })
    });

    if (response.ok) {
      const data = await response.json();
      const suggestion = data.choices[0]?.message?.content || "No suggestion generated.";
      return NextResponse.json({ suggestion });
    } else {
      const err = await response.text();
      return NextResponse.json({ error: `AI Error: ${err}` }, { status: 500 });
    }

  } catch (error) {
    console.error("Suggestion API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
