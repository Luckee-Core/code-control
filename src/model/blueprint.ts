export type BlueprintStatus = 'draft' | 'published' | 'archived';
export type BlueprintDifficulty = 'entry-level' | 'intermediate' | 'advanced';

export type BlueprintSEO = {
  metaDescription: string;
  metaKeywords: string[];
  imageAltText: string;
};

export type Blueprint = {
  id: string;
  slug: string;
  status: BlueprintStatus;
  title: string;
  description: string | null;
  longDescription: string | null;
  heroImagePath: string | null;
  topics: string[];
  difficulty: BlueprintDifficulty;
  estimatedDuration: string | null;
  seo: BlueprintSEO;
  projectIds: string[];
  language: string;
  translationOf: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
