export type GoogleMapsScrapeRunStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export type GoogleMapsScrapeRun = {
  id: string;
  name: string; // User-friendly name like "Philadelphia Plumbers - Jan 2026"
  searchQuery: string; // The query used
  status: GoogleMapsScrapeRunStatus;
  resultsCount: number;
  businessesImported: number;
  maxResults?: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  duration?: number; // milliseconds
};
