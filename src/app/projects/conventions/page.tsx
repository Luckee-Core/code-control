'use client';

import { ConventionsTable } from '@/packages/conventions';
import { useBreadcrumbs } from '@/hooks';

const styles = {
  title: `
    text-lg font-semibold text-gray-900 mb-4
  `,
};

export default function ConventionsPage() {
  useBreadcrumbs([{ label: 'Projects', href: '/projects' }, { label: 'Conventions' }]);

  return (
    <div className="w-full">
      <h1 className={styles.title}>Conventions</h1>
      <ConventionsTable />
    </div>
  );
}
