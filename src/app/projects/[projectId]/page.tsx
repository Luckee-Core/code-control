'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCurrentProjectThunk } from '@/store/thunks/projects';
import { ProjectWorkspace } from '@/packages/project-detail-page';
import { useBreadcrumbs } from '@/hooks';

export default function ProjectDetailRoute() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);
  const project = projects.find((p) => p.id === projectId);

  useBreadcrumbs([
    { label: 'Projects', href: '/projects' },
    { label: project?.name ?? '…' },
  ]);

  useEffect(() => {
    if (project) {
      dispatch(setCurrentProjectThunk(project));
    }
  }, [dispatch, project]);

  if (!project) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Project not found</p>
        <button type="button" onClick={() => router.push('/projects')} className={styles.backButton}>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <ProjectWorkspace />
    </div>
  );
}

const styles = {
  pageContainer: `w-full flex-1 min-h-0 flex flex-col`,
  container: ``,
  loading: `text-gray-600 mb-4`,
  backButton: `px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300`,
};
