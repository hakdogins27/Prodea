/**
 * Deep merge - prevents updated_state from wiping untouched fields.
 * If the update is an object but the base expects a string (or vice-versa),
 * it ensures it doesn't pollute the UI as [object Object].
 */
export function deepMerge(base: any, updates: any): any {
  const result = { ...base };
  for (const key of Object.keys(updates || {})) {
    const u = updates[key];
    const b = base[key];

    if (
      u && typeof u === 'object' && !Array.isArray(u) && 
      b && typeof b === 'object' && !Array.isArray(b)
    ) {
      result[key] = deepMerge(b, u);
    } else if (u !== undefined && u !== null) {
      if (Array.isArray(u) && typeof b === 'string') {
        // Automatically convert arrays into clean bulleted lists
        result[key] = u.map(item => typeof item === 'string' && !item.startsWith('-') ? `- ${item}` : item).join('\n');
      } else if (typeof u === 'object' && typeof b === 'string') {
        const humanize = (obj: any): string => {
          return Object.entries(obj).map(([k, v]) => {
            const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1');
            return `- ${label}: ${typeof v === 'object' ? JSON.stringify(v) : v}`;
          }).join('\n');
        };
        result[key] = humanize(u);
      } else {
        result[key] = u;
      }
    }
  }
  return result;
}
