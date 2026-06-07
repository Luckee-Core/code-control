export type EntityField = {
  name: string;
  type: string;
  nullable: boolean;
  default_value?: string;
  references_table?: string;
};

export type MarketplaceEntity = {
  name: string;
  table_name: string;
  description: string;
  repos: string[];
  fields: EntityField[];
};

export const MARKETPLACE_ENTITIES: MarketplaceEntity[] = [
  {
    name: 'Vendor',
    table_name: 'vendors',
    description: 'Sellers on the marketplace',
    repos: ['seller_web', 'seller_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'business_name', type: 'text', nullable: false },
      { name: 'email', type: 'text', nullable: false },
      { name: 'phone', type: 'text', nullable: true },
      { name: 'status', type: 'text', nullable: false, default_value: 'pending' },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
  {
    name: 'Product',
    table_name: 'products',
    description: 'Products listed on the marketplace',
    repos: ['seller_web', 'seller_mobile', 'buyer_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'vendor_id', type: 'uuid', nullable: false, references_table: 'vendors' },
      { name: 'name', type: 'text', nullable: false },
      { name: 'description', type: 'text', nullable: true },
      { name: 'price', type: 'decimal', nullable: false },
      { name: 'category_id', type: 'uuid', nullable: true, references_table: 'categories' },
      { name: 'status', type: 'text', nullable: false, default_value: 'draft' },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
  {
    name: 'Buyer',
    table_name: 'buyers',
    description: 'Customers on the marketplace',
    repos: ['buyer_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'email', type: 'text', nullable: false },
      { name: 'name', type: 'text', nullable: false },
      { name: 'phone', type: 'text', nullable: true },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
  {
    name: 'Order',
    table_name: 'orders',
    description: 'Purchase orders',
    repos: ['seller_web', 'seller_mobile', 'buyer_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'buyer_id', type: 'uuid', nullable: false, references_table: 'buyers' },
      { name: 'vendor_id', type: 'uuid', nullable: false, references_table: 'vendors' },
      { name: 'total', type: 'decimal', nullable: false },
      { name: 'status', type: 'text', nullable: false, default_value: 'pending' },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
  {
    name: 'Payment',
    table_name: 'payments',
    description: 'Payment transactions',
    repos: ['seller_web', 'buyer_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'order_id', type: 'uuid', nullable: false, references_table: 'orders' },
      { name: 'amount', type: 'decimal', nullable: false },
      { name: 'status', type: 'text', nullable: false },
      { name: 'payment_method', type: 'text', nullable: false },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
  {
    name: 'Review',
    table_name: 'reviews',
    description: 'Product and vendor reviews',
    repos: ['seller_web', 'buyer_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'product_id', type: 'uuid', nullable: true, references_table: 'products' },
      { name: 'vendor_id', type: 'uuid', nullable: true, references_table: 'vendors' },
      { name: 'buyer_id', type: 'uuid', nullable: false, references_table: 'buyers' },
      { name: 'rating', type: 'integer', nullable: false },
      { name: 'comment', type: 'text', nullable: true },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
  {
    name: 'Category',
    table_name: 'categories',
    description: 'Product categories',
    repos: ['seller_web', 'buyer_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'name', type: 'text', nullable: false },
      { name: 'parent_id', type: 'uuid', nullable: true, references_table: 'categories' },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
  {
    name: 'Message',
    table_name: 'messages',
    description: 'Buyer-vendor communication',
    repos: ['seller_web', 'seller_mobile', 'buyer_mobile'],
    fields: [
      { name: 'id', type: 'uuid', nullable: false },
      { name: 'buyer_id', type: 'uuid', nullable: false, references_table: 'buyers' },
      { name: 'vendor_id', type: 'uuid', nullable: false, references_table: 'vendors' },
      { name: 'sender_type', type: 'text', nullable: false },
      { name: 'content', type: 'text', nullable: false },
      { name: 'created_at', type: 'timestamptz', nullable: false },
    ],
  },
];
