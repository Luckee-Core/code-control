import type { TiptapContent } from './content';

export type JobStatus = 'draft' | 'published' | 'archived';
export type AssessmentType = 'quiz' | 'exercise' | 'none';

export type JobResource = {
  id: string;
  title: string;
  url: string;
  description: string;
};

export type Job = {
  id: string;
  projectId: string;
  slug: string;
  status: JobStatus;
  title: string;
  content: TiptapContent | Record<string, unknown>;
  assessmentType: AssessmentType;
  resources: JobResource[] | null;
  xp: number;
  estimatedDuration: string | null;
  order: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
