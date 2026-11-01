export type CustomerOpsSyncComparePayload = {
  localCustomers: Array<{
    id: string;
    name: string;
    description: string | null;
    stage: string;
    created_at: string;
    updated_at: string;
  }>;
  opsCustomers: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  suggestions: Array<{
    localCustomerId: string;
    suggestedOpsCustomerId: string | null;
    matchKind: string;
    normalizedName: string;
  }>;
  summary: {
    localCount: number;
    opsCount: number;
    unmatchedLocalCount: number;
    opsOnlyCount: number;
  };
};

export type CustomerOpsSyncDecision = {
  localCustomerId: string;
  action: 'link' | 'create';
  opsCustomerId?: string;
};

export type CustomerOpsSyncApplyPayload = {
  results: Array<{
    localCustomerId: string;
    action: string;
    opsCustomerId: string | null;
    status: string;
    error?: string;
  }>;
  summary: {
    ok: number;
    failed: number;
    skipped: number;
  };
};
