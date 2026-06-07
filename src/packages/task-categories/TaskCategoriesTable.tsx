import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { TaskCategoryBuilderActions } from '@/store/builders/taskCategoryBuilder';
import { CurrentTaskCategoryActions } from '@/store/current/currentTaskCategory';
import { deleteTaskCategoryThunk } from '@/store/thunks/task-categories';
import { TaskCategory } from '@/model';

export const TaskCategoriesTable = () => {
  const dispatch = useAppDispatch();
  const taskCategoriesRecord = useAppSelector((state) => state.taskCategories);
  const selectedRepoType = useAppSelector((state) => state.taskCategoryBuilder.selectedRepoType);

  // Convert Record to Array
  const allCategories = useMemo(() => {
    return Object.values(taskCategoriesRecord);
  }, [taskCategoriesRecord]);

  const filteredCategories = useMemo(() => {
    if (!selectedRepoType) return allCategories;
    if (selectedRepoType === 'shared') {
      return allCategories.filter((c) => c.repo_type === null);
    }
    return allCategories.filter((c) => c.repo_type === selectedRepoType);
  }, [allCategories, selectedRepoType]);

  const groupedCategories = useMemo(() => {
    if (selectedRepoType) {
      const groupKey = selectedRepoType === 'shared' ? 'shared' : selectedRepoType;
      return { [groupKey]: filteredCategories };
    }
    
    const grouped: Record<string, TaskCategory[]> = {};
    allCategories.forEach((cat) => {
      const key = cat.repo_type || 'shared';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(cat);
    });
    
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.sort_order - b.sort_order);
    });
    
    return grouped;
  }, [allCategories, selectedRepoType, filteredCategories]);

  const handleEdit = (category: TaskCategory) => {
    dispatch(CurrentTaskCategoryActions.setCurrentTaskCategory(category));
    dispatch(TaskCategoryBuilderActions.openTaskCategoryModal(category.id));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task category?')) return;
    await dispatch(deleteTaskCategoryThunk(id));
  };

  const renderTable = (categories: TaskCategory[]) => (
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
        {categories.map((category) => (
          <tr key={category.id} className={styles.row}>
            <td className={styles.cell}>{category.name}</td>
            <td className={styles.cell}>
              {category.description || <span className={styles.empty}>—</span>}
            </td>
            <td className={styles.cell}>
              <span className={styles.repoTypeBadge}>
                {category.repo_type || 'shared'}
              </span>
            </td>
            <td className={styles.cell}>{category.sort_order}</td>
            <td className={styles.cell}>
              <span className={category.is_active ? styles.activeBadge : styles.inactiveBadge}>
                {category.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className={styles.cell}>
              <div className={styles.actionButtons}>
                <button onClick={() => handleEdit(category)} className={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => handleDelete(category.id)} className={styles.deleteButton}>
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
        {Object.entries(groupedCategories).map(([repoType, categories]) => (
          <div key={repoType} className={styles.group}>
            <h2 className={styles.groupTitle}>{repoType}</h2>
            {renderTable(categories)}
          </div>
        ))}
      </div>
    );
  }

  return <div className={styles.tableContainer}>{renderTable(filteredCategories)}</div>;
};

const styles = {
  groupedContainer: `
    space-y-8 max-h-[calc(100vh-250px)] overflow-y-auto
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
    max-h-[calc(100vh-250px)] overflow-y-auto
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
