import type { Customer } from '@/model/customer';

export const formatCustomerStatus = (status: Customer['status']): string => {
  switch (status) {
    case 'pending_review':
      return 'Pending review';
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    default:
      return status;
  }
};

export const statusColor = (status: Customer['status']): string => {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'pending_review':
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200';
  }
};
