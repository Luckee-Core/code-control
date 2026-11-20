export type NavigationLink = {
  name: string;
  href: string;
  children?: NavigationLink[];
  /** Shows the number of agent runs waiting on you (draft + needs review) for this agent. */
  badge?: 'pr' | 'convention' | 'template';
  /** Extra path prefixes that count as this link being active (detail pages). */
  activePrefixes?: string[];
};
