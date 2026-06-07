import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { BuildStepBuilderActions } from '@/store/builders/buildStepBuilder';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';
import { deleteBuildStepThunk } from '@/store/thunks/build-steps';
import { BuildStep } from '@/model';

export const BuildStepsTable = () => {
  const dispatch = useAppDispatch();
  const buildStepsRecord = useAppSelector((state) => state.buildSteps);
  const selectedRepoType = useAppSelector((state) => state.buildStepBuilder.selectedRepoType);

  // Convert Record to Array
  const allSteps = useMemo(() => {
    return Object.values(buildStepsRecord);
  }, [buildStepsRecord]);

  const filteredSteps = useMemo(() => {
    if (!selectedRepoType) return allSteps;
    return allSteps.filter((s) => s.repo_type === selectedRepoType);
  }, [allSteps, selectedRepoType]);

  const groupedSteps = useMemo(() => {
    if (selectedRepoType) return { [selectedRepoType]: filteredSteps };
    
    const grouped: Record<string, BuildStep[]> = {};
    allSteps.forEach((step) => {
      if (!grouped[step.repo_type]) grouped[step.repo_type] = [];
      grouped[step.repo_type].push(step);
    });
    
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.sort_order - b.sort_order);
    });
    
    return grouped;
  }, [allSteps, selectedRepoType, filteredSteps]);

  const handleEdit = (step: BuildStep) => {
    dispatch(CurrentBuildStepActions.setCurrentBuildStep(step));
    dispatch(BuildStepBuilderActions.openBuildStepModal(step.id));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this build step?')) return;
    await dispatch(deleteBuildStepThunk(id));
  };

  const renderTable = (steps: BuildStep[]) => (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.headerCell}>Name</th>
          <th className={styles.headerCell}>Description</th>
          <th className={styles.headerCell}>Repo Type</th>
          <th className={styles.headerCell}>Sort Order</th>
          <th className={styles.headerCell}>Status</th>
          <th className={styles.headerCell}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {steps.map((step) => (
          <tr key={step.id} className={styles.row}>
            <td className={styles.cell}>{step.name}</td>
            <td className={styles.cell}>
              {step.description || <span className={styles.empty}>—</span>}
            </td>
            <td className={styles.cell}>
              <span className={styles.repoTypeBadge}>{step.repo_type}</span>
            </td>
            <td className={styles.cell}>{step.sort_order}</td>
            <td className={styles.cell}>
              <span className={step.is_active ? styles.activeBadge : styles.inactiveBadge}>
                {step.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className={styles.cell}>
              <div className={styles.actionButtons}>
                <button onClick={() => handleEdit(step)} className={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => handleDelete(step.id)} className={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (!selectedRepoType) {
    return (
      <div className={styles.groupedContainer}>
        {Object.entries(groupedSteps).map(([repoType, steps]) => (
          <div key={repoType} className={styles.group}>
            <h2 className={styles.groupTitle}>{repoType}</h2>
            {renderTable(steps)}
          </div>
        ))}
      </div>
    );
  }

  return <div className={styles.tableContainer}>{renderTable(filteredSteps)}</div>;
};

const styles = {
  groupedContainer: `
    space-y-8
  `,
  group: `
    border border-gray-200 rounded-lg overflow-hidden
  `,
  groupTitle: `
    px-6 py-4 bg-gray-50 border-b border-gray-200
    text-lg font-semibold text-gray-900
    capitalize
  `,
  tableContainer: `
    border border-gray-200 rounded-lg overflow-hidden
  `,
  table: `
    w-full
  `,
  headerRow: `
    bg-gray-50 border-b border-gray-200
  `,
  headerCell: `
    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
  `,
  row: `
    border-b border-gray-100
    hover:bg-gray-50 transition-colors
  `,
  cell: `
    px-6 py-4 text-sm text-gray-900
  `,
  empty: `
    text-gray-400 italic
  `,
  repoTypeBadge: `
    inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded
    capitalize
  `,
  activeBadge: `
    inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded
  `,
  inactiveBadge: `
    inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded
  `,
  actionButtons: `
    flex items-center gap-2
  `,
  editButton: `
    px-3 py-1 text-sm font-medium text-blue-600
    hover:bg-blue-50 rounded
    transition-colors
  `,
  deleteButton: `
    px-3 py-1 text-sm font-medium text-red-600
    hover:bg-red-50 rounded
    transition-colors
  `,
};
