import { getAnthropicModelPricing } from './anthropic-model-pricing';

/**
 * Estimated USD cost of one AI call from its token usage, or null when the model has no known rates.
 */
export const computeExchangeCostUsd = (
  inputTokens: number,
  outputTokens: number,
  modelUsed: string | null | undefined,
): number | null => {
  const rates = getAnthropicModelPricing(modelUsed);
  if (!rates) return null;
  return (
    (inputTokens / 1_000_000) * rates.input_cost_per_million_usd +
    (outputTokens / 1_000_000) * rates.output_cost_per_million_usd
  );
};
