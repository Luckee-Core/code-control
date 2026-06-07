'use client';

import type { ProjectRepo } from '@/api/project-setup';
import { ServerRepoRow } from './row';

type ServerReposSectionProps = {
  expressRepo: ProjectRepo | null;
  expressSlug: string;
  onExpressSlugChange: (value: string) => void;
  onCreateExpressRepo: () => void;
  isCreating: boolean;
  errorMessage: string | null;
};

export const ServerReposSection = ({
  expressRepo,
  expressSlug,
  onExpressSlugChange,
  onCreateExpressRepo,
  isCreating,
  errorMessage,
}: ServerReposSectionProps) => {
  return (
    <>
      <ServerRepoRow
        expressRepo={expressRepo}
        expressSlug={expressSlug}
        onExpressSlugChange={onExpressSlugChange}
        onCreateExpressRepo={onCreateExpressRepo}
        isCreating={isCreating}
      />
      {errorMessage && (
        <p className={styles.errorText}>{errorMessage}</p>
      )}
    </>
  );
};

const styles = {
  errorText: `
    text-xs text-red-600 mt-2
  `,
};
