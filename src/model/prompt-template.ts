// Prompt template types
export type PromptTemplateType =
  | 'summarize-content'
  | 'generate-next-unit'
  | 'user-background-summary'
  | 'upwork-application'
  | 'first-outreach'
  | 'follow-up-short'
  | 'follow-up-medium'
  | 'follow-up-detailed'
  | 'final-attempt'
  | 're-engagement';

// Modular section interfaces (snake_case)
export type BrandPositioning = {
  company: string;
  location: string;
  value_prop: string;
  differentiation: string;
};

export type IntroductionStrategy = {
  style: 'value-first' | 'location-first' | 'context-first' | 'custom';
  length: 'short' | 'medium' | 'long';
  custom_intros: string[];
};

export type ContentFocus = {
  emphasis: 'time-savings' | 'dollar-impact' | 'efficiency' | 'custom';
  metrics: {
    hours_per_week: number;
    dollar_value: number;
    employee_type: string;
  };
};

export type ServiceSections = {
  email_automation: {
    enabled: boolean;
    bullets: string[];
  };
  content_research: {
    enabled: boolean;
    bullets: string[];
  };
};

export type PricingStrategy = {
  show_pricing: boolean;
  style: 'transparent' | 'range-only' | 'custom';
  custom_text?: string;
};

export type CallToAction = {
  style: 'soft-close' | 'direct' | 'conversational' | 'bold';
  custom_text?: string;
};

export type LanguageControls = {
  prohibited_phrases: string[];
  tone: 'casual-confident' | 'professional-direct' | 'custom';
  industry_adaptation: boolean;
};

export type ModularEmailConfig = {
  brand_positioning: BrandPositioning;
  introduction_strategy: IntroductionStrategy;
  content_focus: ContentFocus;
  service_sections: ServiceSections;
  pricing_strategy: PricingStrategy;
  call_to_action: CallToAction;
  language_controls: LanguageControls;
};

export type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  type: PromptTemplateType;
  is_default: boolean;
  content: string; // Legacy support - raw content for old templates
  modular_config?: ModularEmailConfig; // New modular configuration
  ai_provider: 'anthropic' | 'openai';
  model: string;
  temperature: number;
  max_tokens: number;
  created_at: string;
  updated_at: string;
};
