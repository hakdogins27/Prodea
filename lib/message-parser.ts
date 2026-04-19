/**
 * Parses the AI assistant's response to extract guidance and direct suggestions.
 * Expects [GUIDANCE] and [SUGGESTION] tags.
 */
export interface PartitionedResponse {
  guidance: string;
  suggestion: string | null;
}

export function parseAssistantResponse(content: string): PartitionedResponse {
  if (!content) return { guidance: "", suggestion: null };

  const guidanceMatch = content.match(/\[GUIDANCE\]([\s\S]*?)\[\/GUIDANCE\]/i);
  const suggestionMatch = content.match(/\[SUGGESTION\]([\s\S]*?)\[\/SUGGESTION\]/i);

  let guidance = guidanceMatch ? guidanceMatch[1].trim() : "";
  let suggestion = suggestionMatch ? suggestionMatch[1].trim() : null;

  // Fallback: If no tags are found, treat the whole content as guidance
  if (!guidance && !suggestion) {
    guidance = content.trim();
  }

  return { guidance, suggestion };
}
