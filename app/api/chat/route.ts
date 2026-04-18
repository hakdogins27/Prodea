import { NextResponse } from 'next/server';
import { EMPTY_STATE_SCHEMA } from '@/lib/constants';
import { deepMerge } from '@/lib/state-utils';
import { EXTRACTION_SYSTEM_PROMPT, REFINEMENT_SYSTEM_PROMPT } from '@/lib/prompts';
import { ChatRequestSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'edge';

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

    // Helper to strip empty/null values to save tokens in Refinement
    const stripEmptyValues = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;
      return Object.fromEntries(
        Object.entries(obj)
          .map(([k, v]) => [k, v && typeof v === 'object' && !Array.isArray(v) ? stripEmptyValues(v) : v])
          .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      );
    };

    // Merge incoming state with the full schema so the backend always has a full record
    const currentState = deepMerge(EMPTY_STATE_SCHEMA, state || {});
    
    // For AI context, strip empty fields to stay under TPM limits (especially 8B)
    const optimizedContextState = stripEmptyValues(currentState);
    
    // Further optimization: AI instructions are already in the system prompt, don't waste tokens in the state
    if (optimizedContextState.aiInstructions) delete optimizedContextState.aiInstructions;

    const systemPrompt = phase === 'extraction' ? EXTRACTION_SYSTEM_PROMPT : REFINEMENT_SYSTEM_PROMPT;
    
    // HYBRID STRATEGY: 70B for big architecture, 8B for fast refinement chatter
    const modelId = phase === 'extraction' ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';

    // Utility to find missing sections
    const getMissingSections = (s: any) => {
      const missing = [];
      if (!s.aiInstructions) missing.push('aiInstructions');
      if (s.overview) {
        Object.entries(s.overview).forEach(([k, v]) => {
          if (!v) missing.push(`overview.${k}`);
        });
      }
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

    // For refinement, we MUST provide the AI with the current state it is working on
    const userMessage = phase === 'refinement' 
      ? `CURRENT PROJECT STATE (Optimized):\n${JSON.stringify(optimizedContextState, null, 2)}\n\nUSER REQUEST: ${message}`
      : message;

    // Prepare message sequence with history
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.role,
        content: m.content
      })).slice(-4),
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
        max_tokens: phase === 'extraction' ? 4500 : 2048,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      
      // If the error is a rate limit (429), provide a clearer message
      const isRateLimit = response.status === 429;
      const details = errorData.error?.message || response.statusText;

      return NextResponse.json({ 
        error: isRateLimit ? 'AI Rate Limit Reached' : 'AI Provider Error', 
        details: isRateLimit ? 'Too many requests. Please wait a few seconds and try again.' : details,
        raw_error: errorData,
        status: response.status 
      }, { status: 424 }); 
    }

    const data = await response.json();
    let raw = data.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: 'AI returned an empty response' }, { status: 424 });
    }

    // 3. Sanitization & Validation of Model Output
    try {
      const parsed = JSON.parse(raw);
      
      // Deep merge — never wipe existing state, only update new fields
      const mergedState = deepMerge(currentState, parsed.updated_state || {});
      
      // Final check for completion
      const finalMissing = getMissingSections(mergedState);

      // Ensure ai_response is a string to prevent React Error #31 in the frontend
      let aiResponse = parsed.ai_response || "Blueprint updated.";
      if (typeof aiResponse === 'object') {
        aiResponse = JSON.stringify(aiResponse);
      }

      return NextResponse.json({
        ai_response: aiResponse,
        updated_state: mergedState,
        isChatCompleted: parsed.isChatCompleted || finalMissing.length === 0,
        missingCount: finalMissing.length
      });
    } catch (e) {
      console.error('Output Parsing Error:', e, raw);
      return NextResponse.json({ 
        error: 'AI mapping failure', 
        details: 'The model failed to produce a valid JSON blueprint. Try refining your request.',
        raw: process.env.NODE_ENV === 'development' ? raw : undefined
      }, { status: 422 }); // 422 Unprocessable Entity
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}