import type { Customer } from '@/model/customer';

export const stageColor = (stage: Customer['stage']): string => {
  switch (stage) {
    case 'discovery_call':
      return 'bg-yellow-100 text-yellow-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
