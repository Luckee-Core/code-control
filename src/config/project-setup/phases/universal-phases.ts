export type RepoType = 'express' | 'nextjs' | 'react-native';

export type Phase = {
  id: string;
  name: string;
  description: string;
  order: number;
  taskTypes: string[];
};

export const UNIVERSAL_PHASES: Record<RepoType, Phase[]> = {
  express: [
    {
      id: 'build_foundation',
      name: 'ARDs',
      description: 'Generate architecture documentation and coding conventions',
      order: 0,
      taskTypes: [
        'ard_agents_md',
        'ard_architecture_readme',
        'ard_file_organization',
        'ard_api_conventions',
        'ard_constants_utilities',
        'ard_managed_clients',
        'ard_edge_boundaries',
        'ard_logging_standards',
      ],
    },
    {
      id: 'data_model',
      name: 'Data Model',
      description: 'Generate models and migrations',
      order: 1,
      taskTypes: ['model', 'migration'],
    },
    {
      id: 'crud_api',
      name: 'CRUD API',
      description: 'Generate API routes and endpoints',
      order: 2,
      taskTypes: ['api_routes'],
    },
    {
      id: 'business_logic',
      name: 'Business Logic',
      description: 'Custom logic and integrations',
      order: 3,
      taskTypes: [],
    },
  ],
  nextjs: [
    {
      id: 'build_foundation',
      name: 'ARDs',
      description: 'Generate architecture documentation and coding conventions',
      order: 0,
      taskTypes: [
        'ard_agents_md',
        'ard_architecture_readme',
        'ard_redux_patterns',
        'ard_file_organization',
        'ard_api_conventions',
        'ard_styling_rules',
        'ard_constants_utilities',
      ],
    },
    {
      id: 'data_model',
      name: 'Data Model',
      description: 'Generate models and types',
      order: 1,
      taskTypes: ['model'],
    },
    {
      id: 'api_integration',
      name: 'API Integration',
      description: 'API client and data fetching',
      order: 2,
      taskTypes: ['api_routes'],
    },
    {
      id: 'pages',
      name: 'Pages & Routes',
      description: 'Page components and routing',
      order: 3,
      taskTypes: ['table_component'],
    },
    {
      id: 'components',
      name: 'Components',
      description: 'Reusable components',
      order: 4,
      taskTypes: ['detail_page'],
    },
  ],
  'react-native': [
    {
      id: 'build_foundation',
      name: 'ARDs',
      description: 'Generate architecture documentation and coding conventions',
      order: 0,
      taskTypes: [
        'ard_agents_md',
        'ard_architecture_readme',
        'ard_redux_patterns',
        'ard_file_organization',
        'ard_api_conventions',
        'ard_styling_rules',
        'ard_constants_utilities',
      ],
    },
    {
      id: 'data_model',
      name: 'Data Model',
      description: 'Generate models and migrations',
      order: 1,
      taskTypes: ['model', 'migration'],
    },
    {
      id: 'api_integration',
      name: 'API Integration',
      description: 'API client and data fetching',
      order: 2,
      taskTypes: ['api_routes'],
    },
    {
      id: 'screens',
      name: 'Screens & Navigation',
      description: 'Screen components and navigation',
      order: 3,
      taskTypes: ['table_component'],
    },
    {
      id: 'state_management',
      name: 'State Management',
      description: 'Redux/store setup',
      order: 4,
      taskTypes: ['detail_page'],
    },
  ],
};

export const getTaskTypesForPhase = (phaseId: string, repoType?: RepoType): string[] => {
  // If repoType is provided, use it directly
  if (repoType && UNIVERSAL_PHASES[repoType]) {
    const phase = UNIVERSAL_PHASES[repoType].find((p) => p.id === phaseId);
    if (phase) return [...phase.taskTypes];
  }
  
  // Fallback: search all repo types (for backward compatibility)
  for (const type of Object.keys(UNIVERSAL_PHASES) as RepoType[]) {
    const phase = UNIVERSAL_PHASES[type].find((p) => p.id === phaseId);
    if (phase) return [...phase.taskTypes];
  }
  return [];
};

export const getNextPhase = (currentPhaseId: string, repoType: RepoType): string | null => {
  const phases = UNIVERSAL_PHASES[repoType];
  const idx = phases.findIndex((p) => p.id === currentPhaseId);
  if (idx === -1 || idx >= phases.length - 1) return null;
  return phases[idx + 1].id;
};

export const getPhasesForRepoType = (repoType: RepoType): Phase[] => {
  return UNIVERSAL_PHASES[repoType] || [];
};
