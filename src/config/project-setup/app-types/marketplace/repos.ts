export type MarketplaceRepo = {
  id: string;
  name: string;
  description: string;
  repo_type: 'express' | 'nextjs' | 'react-native';
  order: number;
};

export const MARKETPLACE_REPOS: MarketplaceRepo[] = [
  {
    id: 'seller_web',
    name: 'Seller Web',
    description: 'Admin/management interface for vendors',
    repo_type: 'nextjs',
    order: 1,
  },
  {
    id: 'seller_mobile',
    name: 'Seller Mobile',
    description: 'Mobile app for vendor management',
    repo_type: 'react-native',
    order: 2,
  },
  {
    id: 'buyer_mobile',
    name: 'Buyer Mobile',
    description: 'Customer-facing mobile app',
    repo_type: 'react-native',
    order: 3,
  },
];
