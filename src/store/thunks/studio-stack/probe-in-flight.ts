type ProbeCode = 200 | 500;

let inFlight: Promise<ProbeCode> | null = null;

/**
 * Coalesces concurrent stack probes (layout auto-check + manual button).
 */
export const runProbeSingleFlight = (run: () => Promise<ProbeCode>): Promise<ProbeCode> => {
  if (inFlight) {
    return inFlight;
  }
  inFlight = run().finally(() => {
    inFlight = null;
  });
  return inFlight;
};
