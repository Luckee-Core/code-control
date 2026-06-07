export type WorkflowAction = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  allowQuantity: boolean;
  quantityLabel: string | null;
  workflowId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Rich content fields
  features?: string[];
  outputDescription?: string;
};
