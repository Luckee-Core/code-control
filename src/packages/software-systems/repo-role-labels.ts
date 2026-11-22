/** Display names for repo_roles keys (falls back to the key). */
export const REPO_ROLE_LABELS: Record<string, string> = {
  storage: 'Storage',
  express: 'API express',
  web: 'Web',
  dispatcher: 'Dispatcher express',
  'dispatcher-web': 'Dispatcher web',
  console: 'Console',
  mobile: 'Mobile',
  python: 'Python',
  gateway: 'Main gateway',
};

export const repoRoleLabel = (key: string): string => REPO_ROLE_LABELS[key] ?? key;
