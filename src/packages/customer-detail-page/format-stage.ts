import type { Customer } from '@/model/customer';

export const formatStage = (stage: Customer['stage']): string => {
  switch (stage) {
    case 'discovery_call':
      return 'Discovery';
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    default:
      return stage;
  }
};
