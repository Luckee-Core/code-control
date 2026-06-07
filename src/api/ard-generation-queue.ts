import { ApiResponse } from './types';
import { ARDGenerationTask } from '../model';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const getARDQueueByRepo = async (
  repoId: string
): Promise<ApiResponse<ARDGenerationTask[]>> => {
  const response = await fetch(`${BASE_URL}/api/data/ard-generation-queue/repo/${repoId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch ARD queue' };
  }

  const data = await response.json();
  return { success: true, data };
};

export type CreateARDQueueItemInput = {
  project_id: string;
  repo_id: string;
  task_id: string;
};

export const createARDQueueItem = async (
  input: CreateARDQueueItemInput
): Promise<ApiResponse<ARDGenerationTask>> => {
  const response = await fetch(`${BASE_URL}/api/data/ard-generation-queue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to create ARD queue item' };
  }

  const data = await response.json();
  return { success: true, data };
};

export type CreateBatchARDQueueInput = {
  project_id: string;
  repo_id: string;
  task_ids: string[];
};

export const createBatchARDQueue = async (
  input: CreateBatchARDQueueInput
): Promise<ApiResponse<ARDGenerationTask[]>> => {
  const response = await fetch(`${BASE_URL}/api/data/ard-generation-queue/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to create ARD queue items' };
  }

  const data = await response.json();
  return { success: true, data };
};

export const getAllARDQueueByProject = async (
  projectId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<ARDGenerationTask[]>> => {
  const baseUrl = apiBaseUrl || BASE_URL;
  const response = await fetch(`${baseUrl}/api/data/ard-generation-queue/project/${projectId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch ARD queue' };
  }

  const data = await response.json();
  return { success: true, data };
};

export type UpdateARDQueueStatusInput = {
  status: 'queued' | 'processing' | 'completed' | 'failed';
};

export const updateARDQueueStatus = async (
  queueItemId: string,
  input: UpdateARDQueueStatusInput
): Promise<ApiResponse<ARDGenerationTask>> => {
  const response = await fetch(
    `${BASE_URL}/api/data/ard-generation-queue/${queueItemId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to update ARD queue item' };
  }

  const data = await response.json();
  return { success: true, data };
};

export const getAllARDQueue = async (
  apiBaseUrl?: string
): Promise<ApiResponse<ARDGenerationTask[]>> => {
  const baseUrl = apiBaseUrl || BASE_URL;
  
  const response = await fetch(`${baseUrl}/api/data/ard-generation-queue`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch ARD queue' };
  }

  const result = await response.json();
  return { success: true, data: result.data };
};

export const deleteARDQueueItem = async (
  queueItemId: string,
  apiBaseUrl?: string
): Promise<ApiResponse<void>> => {
  const baseUrl = apiBaseUrl || BASE_URL;
  
  const response = await fetch(`${baseUrl}/api/data/ard-generation-queue/${queueItemId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to delete ARD queue item' };
  }

  const result = await response.json();
  return { success: true, data: undefined };
};

