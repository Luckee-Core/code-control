export type AppType = 'marketplace' | 'field_service' | 'social' | 'saas' | 'custom';

export type EntityTemplateField = {
  name: string;
  type: string;
  nullable: boolean;
  default_value?: string;
  references_table?: string;
};

export type EntityTemplate = {
  name: string;
  table_name: string;
  description?: string;
  platforms: string[];
  fields: EntityTemplateField[];
};

export type PlatformConfig = {
  id: string;
  name: string;
  description?: string;
  repo_type: string;
  order: number;
};

export type BuildPhase = {
  id: string;
  name: string;
  description?: string;
  order: number;
  tasks: string[];
  depends_on?: string[];
};

export type AppTypeTemplate = {
  id: string;
  app_type: string;
  name: string;
  description: string | null;
  entity_templates: unknown | null;
  platform_config: unknown | null;
  build_phases: {
    mobile?: BuildPhase[];
    express?: BuildPhase[];
    web?: BuildPhase[];
  };
  created_at: string;
  updated_at: string;
};
