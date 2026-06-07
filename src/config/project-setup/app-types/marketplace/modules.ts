export type MarketplaceModule = {
  id: string;
  name: string;
  description: string;
  order: number;
  repos: string[];
  entities: string[];
  tasks: string[];
};

export const MARKETPLACE_MODULES: MarketplaceModule[] = [
  {
    id: 'vendor_onboarding',
    name: 'Vendor Onboarding',
    description: 'Registration, verification, and profile setup for sellers',
    order: 1,
    repos: ['seller_web', 'seller_mobile'],
    entities: ['Vendor'],
    tasks: [
      'Create vendor registration form',
      'Build email verification workflow',
      'Design vendor profile dashboard',
      'Implement document upload for verification',
      'Create vendor status management',
    ],
  },
  {
    id: 'product_management',
    name: 'Product Management',
    description: 'Product listing, editing, and inventory management',
    order: 2,
    repos: ['seller_web', 'seller_mobile'],
    entities: ['Product', 'Category'],
    tasks: [
      'Create product listing form',
      'Build image upload and gallery',
      'Implement category selection',
      'Create inventory tracking',
      'Build product status management (draft/published)',
    ],
  },
  {
    id: 'buyer_experience',
    name: 'Buyer Experience',
    description: 'Product browsing, search, and filtering for customers',
    order: 3,
    repos: ['buyer_mobile'],
    entities: ['Product', 'Category', 'Buyer'],
    tasks: [
      'Build product catalog with grid/list views',
      'Implement search functionality',
      'Create category filters',
      'Build product detail view',
      'Implement favorites/wishlist',
    ],
  },
  {
    id: 'order_checkout',
    name: 'Order & Checkout',
    description: 'Shopping cart, checkout flow, and order placement',
    order: 4,
    repos: ['buyer_mobile', 'seller_web'],
    entities: ['Order', 'Payment'],
    tasks: [
      'Build shopping cart',
      'Create checkout flow',
      'Implement payment integration',
      'Build order confirmation',
      'Create order tracking for buyers',
      'Build order management for sellers',
    ],
  },
  {
    id: 'reviews_ratings',
    name: 'Reviews & Ratings',
    description: 'Product and vendor reviews and ratings system',
    order: 5,
    repos: ['buyer_mobile', 'seller_web'],
    entities: ['Review'],
    tasks: [
      'Create review submission form',
      'Build star rating component',
      'Implement review display on products',
      'Create review moderation for sellers',
      'Build review analytics dashboard',
    ],
  },
  {
    id: 'messaging',
    name: 'Buyer-Seller Messaging',
    description: 'Communication between buyers and vendors',
    order: 6,
    repos: ['buyer_mobile', 'seller_web', 'seller_mobile'],
    entities: ['Message'],
    tasks: [
      'Create message thread UI',
      'Build real-time messaging',
      'Implement message notifications',
      'Create message history',
      'Build message search',
    ],
  },
];
