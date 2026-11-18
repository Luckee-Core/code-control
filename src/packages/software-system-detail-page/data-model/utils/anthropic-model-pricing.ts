/**
 * Client-side $/1M token estimates for the Anthropic Messages API (womenheart-admin-panel / luckee-web pattern).
 * Standard-tier list prices as of 2026-11. Update when Anthropic publishes new prices.
 * Used only for the AI calls cost table, not billing. Thinking tokens are billed as output.
 */
export type AnthropicModelPricing = {
  input_cost_per_million_usd: number;
  output_cost_per_million_usd: number;
};

export const ANTHROPIC_MODEL_PRICING_BY_MODEL_ID: Record<string, AnthropicModelPricing> = {
  'claude-fable-5-2': { input_cost_per_million_usd: 8, output_cost_per_million_usd: 40 },
  'claude-fable-5-1': { input_cost_per_million_usd: 10, output_cost_per_million_usd: 50 },
  'claude-fable-5': { input_cost_per_million_usd: 10, output_cost_per_million_usd: 50 },
  'claude-opus-5-5': { input_cost_per_million_usd: 4, output_cost_per_million_usd: 20 },
  'claude-opus-5': { input_cost_per_million_usd: 5, output_cost_per_million_usd: 25 },
  'claude-opus-4-8': { input_cost_per_million_usd: 5, output_cost_per_million_usd: 25 },
  'claude-opus-4-7': { input_cost_per_million_usd: 5, output_cost_per_million_usd: 25 },
  'claude-sonnet-5-5': { input_cost_per_million_usd: 2, output_cost_per_million_usd: 10 },
  'claude-sonnet-5': { input_cost_per_million_usd: 2, output_cost_per_million_usd: 10 },
  'claude-sonnet-4-6': { input_cost_per_million_usd: 3, output_cost_per_million_usd: 15 },
  // Haiku 5.5 is $0.50 / $2.50 when the prompt exceeds 100K tokens; data-model prompts stay well under.
  'claude-haiku-5-5': { input_cost_per_million_usd: 0.1, output_cost_per_million_usd: 0.5 },
  'claude-haiku-4-5': { input_cost_per_million_usd: 1, output_cost_per_million_usd: 5 },
};

/** Rates for a model id; dated ids (e.g. `claude-haiku-4-5-20251001`) fall back to their base id. */
export const getAnthropicModelPricing = (modelUsed: string | null | undefined): AnthropicModelPricing | undefined => {
  if (!modelUsed) return undefined;
  if (ANTHROPIC_MODEL_PRICING_BY_MODEL_ID[modelUsed]) return ANTHROPIC_MODEL_PRICING_BY_MODEL_ID[modelUsed];
  const base = Object.keys(ANTHROPIC_MODEL_PRICING_BY_MODEL_ID)
    .filter((id) => modelUsed.startsWith(`${id}-`))
    .sort((a, b) => b.length - a.length)[0];
  return base ? ANTHROPIC_MODEL_PRICING_BY_MODEL_ID[base] : undefined;
};
