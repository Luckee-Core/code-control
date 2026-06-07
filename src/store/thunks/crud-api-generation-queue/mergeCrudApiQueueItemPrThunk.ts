import type { AppThunk } from '@/store';
import { mergeCrudApiQueueItemPr } from '@/api/crud-api-generation-queue';
import { getApiBaseUrl } from '@/api/config';

export type MergePrThunkResult = { status: number; error?: string };

export const mergeCrudApiQueueItemPrThunk = (queueItemId: string): AppThunk<Promise<MergePrThunkResult>> => {
  return async (): Promise<MergePrThunkResult> => {
    const result = await mergeCrudApiQueueItemPr(queueItemId, getApiBaseUrl());
    if (result.success) {
      return { status: 200 };
    }
    return { status: result.status ?? 500, error: result.error };
  };
};
