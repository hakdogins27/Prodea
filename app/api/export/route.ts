import { NextResponse } from 'next/server';
import { ExportRequestSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';
import { renderBlueprint } from '@/lib/blueprint-renderer';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = rateLimit(ip, 10, 60000); // 10 exports per minute
    if (!limiter.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // 2. Body Validation
    const body = await req.json().catch(() => ({}));
    const validated = ExportRequestSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: validated.error.flatten() 
      }, { status: 400 });
    }

    const { state, mode } = validated.data;

    // --- AI ASSISTED MODE ---
    if (mode === 'assisted') {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "Missing Groq API Key for Assisted Export." }, { status: 500 });
      }

      const systemPrompt = `You are a "Senior Product Architect". Generate a high-clarity, professional 20-SECTION PROJECT.md blueprint.

MISSION:
1. Infer professional, connected content for all 20 sections based on JSON state.
2. Structure high-density technical layers using MARKDOWN TABLES.
3. Keep the layout flat, professional, and optimized for AI-native coding.

STRICT FORMATTING RULES:
- Use ## [N]. [Section Name] for all 20 architectural sections.
- Use MARKDOWN TABLES for: Tech Stack (Layer|Tech|Version|Notes), Architecture Decisions (Decision|Choice|Reason), API Contract (Method|Endpoint|Desc|Auth), and Known Risks (Risk|Likelihood|Impact|Mitigation).
- Section 0 (AI Instructions): Provide 5-8 precise guardrails at the top.
- Section 16 (Env Vars): Provide a code block sample .env.example.
- NO introductory/concluding fluff. Start immediately with the title.

Current State:
${JSON.stringify(state, null, 2)}`;

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }],
          temperature: 0.2
        })
      });

      if (response.ok) {
        const data = await response.json();
        const markdown = data.choices[0]?.message?.content || "Export generation failed.";
        return NextResponse.json({ markdown });
      }
    }

    // --- CLEAN / DEFAULT MODE (Unified Renderer) ---
    const markdown = renderBlueprint(state);
    return NextResponse.json({ markdown });

  } catch (error) {
    console.error("Export API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
