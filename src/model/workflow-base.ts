export type WorkflowUseCase = {
  title: string;
  description: string;
};

export type WorkflowIncludedFeature = {
  title: string;
  description: string;
};

export type WorkflowSourceOption = {
  type: string;
  example: string;
};

export type WorkflowBase = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Rich content fields
  valueProposition?: string;
  whatIsIt?: string;
  useCases?: WorkflowUseCase[];
  includedFeatures?: WorkflowIncludedFeature[];
  sourceOptions?: WorkflowSourceOption[];
};
