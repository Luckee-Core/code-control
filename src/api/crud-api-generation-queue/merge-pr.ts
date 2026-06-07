export type MergePrResult =
  | { success: true; merged: true }
  | { success: false; error: string; status?: number };

export const mergeCrudApiQueueItemPr = async (
  queueItemId: string,
  baseUrl: string
): Promise<MergePrResult> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/data/crud-api-generation-queue/${queueItemId}/merge-pr`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    const data = await response.json().catch(() => ({})) as { success?: boolean; merged?: boolean; error?: string };

    if (response.ok && data.success) {
      return { success: true, merged: true };
    }
    return {
      success: false,
      error: data.error || response.statusText || 'Merge failed',
      status: response.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { success: false, error: message };
  }
};
