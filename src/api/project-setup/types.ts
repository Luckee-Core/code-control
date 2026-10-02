export type CreateRepoResponse = {
  success: boolean;
  already_done?: boolean;
  repo_url?: string;
  clone_url?: string;
  error?: string;
};
