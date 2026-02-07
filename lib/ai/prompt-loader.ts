/**
 * Dynamic Prompt Loader - Load prompts from database
 * Fallback to hardcoded prompts if database unavailable
 */

import { createClient } from '@/lib/supabase/server';

export interface PromptTemplate {
  id: string;
  name: string;
  slug: string;
  type: 'system' | 'medical' | 'knowledge' | 'json-formatter';
  content: string;
  variables: string[];
  is_active: boolean;
  version: number;
  metadata?: Record<string, any>;
}

/**
 * Load active prompt by slug from database
 */
export async function loadPromptBySlug(slug: string): Promise<PromptTemplate | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error(`[v0] Failed to load prompt ${slug}:`, error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[v0] Prompt loader error:', error);
    return null;
  }
}

/**
 * Load all active prompts by type
 */
export async function loadPromptsByType(type: PromptTemplate['type']): Promise<PromptTemplate[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('version', { ascending: false });

    if (error) {
      console.error(`[v0] Failed to load prompts type ${type}:`, error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[v0] Prompt loader error:', error);
    return [];
  }
}

/**
 * Interpolate variables into prompt template
 * Variables format: {{variableName}}
 */
export function interpolatePrompt(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;
  
  // Replace {{variable}} with actual values
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value ?? ''));
  }
  
  return result;
}

/**
 * Build prompt with fallback to hardcoded version
 */
export async function buildPromptWithFallback(
  slug: string,
  variables: Record<string, any>,
  fallbackTemplate: string
): Promise<string> {
  // Try to load from database
  const dbPrompt = await loadPromptBySlug(slug);
  
  if (dbPrompt) {
    console.log(`[v0] Using database prompt: ${slug} v${dbPrompt.version}`);
    return interpolatePrompt(dbPrompt.content, variables);
  }
  
  // Fallback to hardcoded
  console.log(`[v0] Using fallback prompt: ${slug}`);
  return interpolatePrompt(fallbackTemplate, variables);
}

/**
 * Cache prompts in memory for performance
 */
const promptCache = new Map<string, { prompt: PromptTemplate; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function loadPromptCached(slug: string): Promise<PromptTemplate | null> {
  const cached = promptCache.get(slug);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.prompt;
  }
  
  const prompt = await loadPromptBySlug(slug);
  
  if (prompt) {
    promptCache.set(slug, { prompt, timestamp: Date.now() });
  }
  
  return prompt;
}

/**
 * Clear prompt cache (useful after updates)
 */
export function clearPromptCache(slug?: string) {
  if (slug) {
    promptCache.delete(slug);
  } else {
    promptCache.clear();
  }
}
