export type ApplicationFeatureAction = {
  id: string;
  featureId: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
