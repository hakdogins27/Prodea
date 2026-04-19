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

      // Helper to strip empty values and truncate long fields to save critical tokens (TPM limits)
      const stripEmptyValues = (obj: any): any => {
        if (!obj || typeof obj !== 'object') {
          // Truncate long strings to 1000 chars to avoid TPM kill
          if (typeof obj === 'string' && obj.length > 1000) {
            return obj.substring(0, 1000) + '... (truncated for architectural analysis)';
          }
          return obj;
        }
        return Object.fromEntries(
          Object.entries(obj)
            .map(([k, v]) => [k, v && typeof v === 'object' && !Array.isArray(v) ? stripEmptyValues(v) : (typeof v === 'string' && v.length > 1000 ? v.substring(0, 1000) + '...' : v)])
            .filter(([_, v]) => v !== null && v !== undefined && v !== '')
        );
      };

      // Prune state to stay under 6k TPM limits for 8B model fallback
      const prunedState = stripEmptyValues(state);
      if (prunedState.aiInstructions) delete prunedState.aiInstructions;
      if (prunedState.changeLog) delete prunedState.changeLog; // Usually not needed for architect summary

      const systemPrompt = `You are a "Senior Product Architect". Respond ONLY with a valid JSON object.

Based on the project state below, generate a personalized, high-clarity 3-4 sentence EXECUTIVE SUMMARY for the project's living documentation. 

Focus on:
1. The project's unique value proposition.
2. The core technical strategy (stack and architecture).
3. The immediate roadmap focus.

### OUTPUT FORMAT:
You MUST respond in a valid JSON format with exactly one key:
- "summary": The personalized executive summary.

Current State to Architect:
${JSON.stringify(prunedState, null, 2)}`;
 
      const FALLBACK_MODEL = 'llama-3.1-8b-instant'; 
      const callGroq = async (model: string) => {
        return fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: systemPrompt }],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 512 // Summary only needs small tokens
          })
        });
      };

      let response = await callGroq("llama-3.3-70b-versatile");

      // Fallback on Rate Limit (429) or JSON Failure (400)
      if (!response.ok && (response.status === 429 || response.status === 400)) {
        console.warn(`Export: Primary model hit ${response.status}, falling back to ${FALLBACK_MODEL}`);
        response = await callGroq(FALLBACK_MODEL);
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error("Export API Upstream Error:", response.status, err);
        return NextResponse.json({ error: `AI Engine Error (${response.status})`, details: err.error?.message }, { status: 424 });
      }

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content || "{}";
        
        try {
          const parsed = JSON.parse(content);
          let summary = parsed.summary || "";

          // Final fallback
          if (!summary && state.overview?.name) {
            summary = `The Prodea Architectural Engine has finalized the blueprint for "${state.overview.name}". All 20 technical sections have been calibrated based on your specific requirements and stack choices.`;
          }

          // HYBRID MODE: Manually render the Technical Body locally for 100% accuracy and token saving
          const markdown = renderBlueprint(state);

          console.log(`[HYBRID EXPORT] Summary Generated: ${summary ? 'Success' : 'Missing'}`);
          
          return NextResponse.json({ markdown, summary });
        } catch (e) {
          console.error("JSON Parsing Error in Export:", e);
          return NextResponse.json({ markdown: renderBlueprint(state), summary: "" });
        }
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
