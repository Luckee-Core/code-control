'use client';

import { useAppSelector } from '@/store';
import { ExternalLink, GitBranch, Calendar, Link } from 'lucide-react';

type RepoDetailsProps = {
  repoId: string;
};

export const RepoDetails = ({ repoId }: RepoDetailsProps) => {
  const repos = useAppSelector((state) => state.projectRepos);
  const repo = repos.find((r) => r.id === repoId);

  if (!repo) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>Repo not found</p>
      </div>
    );
  }

  const createdDate = repo.created_at ? new Date(repo.created_at).toLocaleString() : 'N/A';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{repo.name}</h2>
        <span className={styles.typeBadge}>{repo.repo_type}</span>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Repository Information</h3>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <GitBranch className="h-4 w-4" />
              <span>Repository ID</span>
            </div>
            <div className={styles.infoValue}>
              <code className={styles.code}>{repo.id}</code>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <Calendar className="h-4 w-4" />
              <span>Created At</span>
            </div>
            <div className={styles.infoValue}>{createdDate}</div>
          </div>

          {repo.repo_url && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <ExternalLink className="h-4 w-4" />
                <span>Repository URL</span>
              </div>
              <div className={styles.infoValue}>
                <a
                  href={repo.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View Repository →
                </a>
              </div>
            </div>
          )}

          {repo.clone_url && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <Link className="h-4 w-4" />
                <span>Clone URL</span>
              </div>
              <div className={styles.infoValue}>
                <code className={styles.code}>{repo.clone_url}</code>
              </div>
            </div>
          )}

          {repo.current_phase && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <span>Current Phase</span>
              </div>
              <div className={styles.infoValue}>
                <span className={styles.phaseBadge}>{repo.current_phase}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: `
    max-w-4xl mx-auto py-6 px-4
  `,
  header: `
    flex items-center gap-3 mb-6
  `,
  title: `
    text-2xl font-bold text-gray-900
  `,
  typeBadge: `
    px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase
  `,
  section: `
    bg-white rounded-lg border border-gray-200 p-6 mb-4
  `,
  sectionTitle: `
    text-lg font-semibold text-gray-900 mb-4
  `,
  infoGrid: `
    space-y-4
  `,
  infoRow: `
    flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0
  `,
  infoLabel: `
    flex items-center gap-2 text-sm font-medium text-gray-600 min-w-[160px]
  `,
  infoValue: `
    flex-1 text-sm text-gray-900
  `,
  code: `
    bg-gray-100 px-2 py-1 rounded text-xs font-mono break-all
  `,
  link: `
    text-blue-600 hover:text-blue-700 hover:underline font-medium
  `,
  phaseBadge: `
    px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium
  `,
  errorText: `
    text-sm text-gray-500
  `,
};

