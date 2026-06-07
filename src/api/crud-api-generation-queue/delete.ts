export const deleteCrudApiQueueItem = async (
  queueItemId: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${baseUrl}/api/data/crud-api-generation-queue/${queueItemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.error || 'Failed to delete queue item' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting CRUD API queue item:', error);
    return { success: false, error: 'Network error' };
  }
};
