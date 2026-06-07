export type CustomApplicationService = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'mobile-app' | 'web-app';
  price: number;
  tags: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
