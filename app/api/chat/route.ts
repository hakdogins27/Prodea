import { NextResponse } from 'next/server';
import { EMPTY_STATE_SCHEMA } from '@/lib/constants';
import { deepMerge } from '@/lib/state-utils';
import { EXTRACTION_SYSTEM_PROMPT, REFINEMENT_SYSTEM_PROMPT } from '@/lib/prompts';
import { ChatRequestSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Simple IP-based)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = rateLimit(ip, 20, 60000); // 20 requests per minute
    if (!limiter.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // 2. Body Validation
    const body = await req.json().catch(() => ({}));
    const validated = ChatRequestSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: validated.error.flatten() 
      }, { status: 400 });
    }

    const { message, state, phase, history } = validated.data;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GROQ_API_KEY' }, { status: 500 });
    }

    // Merge incoming state with the full schema so the AI always sees all fields
    const currentState = deepMerge(EMPTY_STATE_SCHEMA, state || {});

    // Utility to find missing sections
    const getMissingSections = (s: any) => {
      const missing = [];
      if (!s.aiInstructions) missing.push('aiInstructions');
      Object.entries(s.overview || {}).forEach(([k, v]) => {
        if (!v) missing.push(`overview.${k}`);
      });
      const otherSectionsAvailable = [
        'featureBacklog', 'techStack', 'constraints',
        'currentState', 'systemArchitecture', 'frontendStructure', 'backendStructure', 
        'databaseDesign', 'apiContract', 'securityLayer', 'performanceStrategy',
        'workflowUsageMap', 'knownRisks', 'devRules', 'envVariables', 'changeLog',
        'futureIdeas', 'finalPrinciple'
      ];
      otherSectionsAvailable.forEach(k => {
        if (!s[k]) missing.push(k);
      });
      return missing;
    };

    const systemPrompt = phase === 'extraction' ? EXTRACTION_SYSTEM_PROMPT : REFINEMENT_SYSTEM_PROMPT;
    const modelId = phase === 'extraction' ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';

    // For refinement, we MUST provide the AI with the current state it is working on
    const userMessage = phase === 'refinement' 
      ? `CURRENT PROJECT STATE:\n${JSON.stringify(currentState, null, 2)}\n\nUSER REQUEST: ${message}`
      : message;

    // Prepare message sequence with history
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.role,
        content: m.content
      })).slice(-10),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        messages: chatMessages,
        temperature: 0.1,
        max_tokens: phase === 'extraction' ? 4096 : 2048,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      return NextResponse.json({ error: 'AI model request failed' }, { status: 502 });
    }

    const data = await response.json();
    let raw = data.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: 'Empty response from model' }, { status: 502 });
    }

    // 3. Sanitization & Validation of Model Output
    try {
      const parsed = JSON.parse(raw);
      
      // Deep merge — never wipe existing state, only update new fields
      const mergedState = deepMerge(currentState, parsed.updated_state || {});
      
      // Final check for completion
      const finalMissing = getMissingSections(mergedState);

      return NextResponse.json({
        ai_response: parsed.ai_response || "Blueprint updated.",
        updated_state: mergedState,
        isChatCompleted: parsed.isChatCompleted || finalMissing.length === 0,
        missingCount: finalMissing.length
      });
    } catch (e) {
      console.error('Output Parsing Error:', e, raw);
      return NextResponse.json({ error: 'Model output was invalid JSON' }, { status: 502 });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}