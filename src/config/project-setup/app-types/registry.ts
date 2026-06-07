import {
  MARKETPLACE_MODULES,
  MARKETPLACE_ENTITIES,
  MARKETPLACE_REPOS,
  type MarketplaceModule,
  type MarketplaceEntity,
  type MarketplaceRepo,
} from './marketplace';

export type AppTypeConfig = {
  modules: MarketplaceModule[];
  entities: MarketplaceEntity[];
  repos: MarketplaceRepo[];
};

export const APP_TYPE_REGISTRY: Record<string, AppTypeConfig> = {
  marketplace: {
    modules: MARKETPLACE_MODULES,
    entities: MARKETPLACE_ENTITIES,
    repos: MARKETPLACE_REPOS,
  },
  // Future app types:
  // saas: { ... },
  // ecommerce: { ... },
};

export const getAppTypeConfig = (appType: string): AppTypeConfig | null => {
  return APP_TYPE_REGISTRY[appType] || null;
};
