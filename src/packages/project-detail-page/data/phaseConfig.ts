export const PHASES = [
  { id: 'build_foundation', name: 'Build Foundation', taskTypes: ['ard_agents_md', 'ard_architecture_readme', 'ard_redux_patterns', 'ard_file_organization', 'ard_api_conventions', 'ard_styling_rules', 'ard_constants_utilities'] },
  { id: 'data_model', name: 'Data Model', taskTypes: ['model', 'migration'] },
  { id: 'crud_operations', name: 'CRUD Operations', taskTypes: ['api_routes'] },
  { id: 'tables', name: 'Tables', taskTypes: ['table_component'] },
  { id: 'detail_pages', name: 'Detail Pages', taskTypes: ['detail_page'] },
] as const;

export const getTaskTypesForPhase = (phaseId: string): string[] => {
  const phase = PHASES.find((p) => p.id === phaseId);
  return phase ? [...phase.taskTypes] : [];
};

export const getNextPhase = (currentPhaseId: string): string | null => {
  const idx = PHASES.findIndex((p) => p.id === currentPhaseId);
  if (idx === -1 || idx >= PHASES.length - 1) return null;
  return PHASES[idx + 1].id;
};
