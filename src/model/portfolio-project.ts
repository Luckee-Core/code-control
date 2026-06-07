export type PortfolioProjectType = 'internal' | 'client';
export type Pricing = 'free' | 'paid';
export type Platform = 'mobile' | 'web' | 'both';
export type ProjectStatus = 'draft' | 'published' | 'archived';
export type MediaType = 'image' | 'video';
export type MediaCategory = 'app-screenshot' | 'website' | 'demo' | 'feature' | 'other';
export type MediaPlatform = 'web' | 'mobile';

export type PortfolioProjectMedia = {
  id: string;
  project_id: string;
  type: MediaType;
  url: string;
  thumbnail: string | null;
  alt: string;
  caption: string | null;
  category: MediaCategory;
  platform: MediaPlatform | null;
  order: number;
  created_at: string;
  updated_at: string;
};

export type PortfolioProject = {
  id: string;
  name: string;
  category: string;
  about: string;
  description: string[];
  technologies: string[];
  banner: string | null;
  logo: string | null;
  icon: string | null;
  project_type: PortfolioProjectType;
  pricing: Pricing;
  platform: Platform;
  links: {
    appStore?: string;
    playStore?: string;
    website?: string;
  };
  status: ProjectStatus;
  order: number;
  created_at: string;
  updated_at: string;
};

export type PortfolioProjectWithMedia = PortfolioProject & {
  media: PortfolioProjectMedia[];
};
