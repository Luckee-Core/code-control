export type TiptapContent = {
  type: 'doc';
  content: TiptapNode[];
};

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
};

export type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type SEO = {
  metaDescription: string;
  metaKeywords: string[];
  imageAltText: string;
  tldr?: string;
};

export type BlogContent = {
  title: string;
  heroImagePath?: string;
  seo: SEO;
  tldr?: string;
  content: TiptapContent;
};

export type ContentLanguage = 'en' | 'es';
export type ContentType = 'blog' | 'course';
export type ContentStatus = 'draft' | 'published';

export type Content = {
  id: string;
  slug: string;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  topics: string[];
  language: ContentLanguage;
  translationOf?: string;
  type: ContentType;
  title: string;
  seo: SEO;
  blog: BlogContent;
  courseId?: string;
  aiSummary?: string;
  highlight?: boolean;
};

export type CreateContentInput = Omit<Content, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateContentInput = Partial<Omit<Content, 'id' | 'createdAt'>>;
