'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { deleteProjectThunk } from '@/store/thunks/projects';
import type { Project } from '@/model/project';

type ProjectRowActionsMenuProps = {
  project: Project;
};

/**
 * Ellipsis menu for project table rows on the customer detail page.
 */
export const ProjectRowActionsMenu = ({ project }: ProjectRowActionsMenuProps) => {
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);

    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    await dispatch(deleteProjectThunk(project.id));
    setIsDeleting(false);
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={styles.trigger}
        aria-label={`Actions for ${project.name}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={isDeleting}
      >
        <MoreVertical className={styles.icon} />
      </button>
      {isOpen && (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            onClick={handleDelete}
            className={styles.menuItemDanger}
            role="menuitem"
            disabled={isDeleting}
          >
            <Trash2 className={styles.menuItemIcon} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `relative flex justify-end`,
  trigger: `
    p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100
    border-none bg-transparent cursor-pointer transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  icon: `h-4 w-4`,
  menu: `
    absolute right-0 top-full mt-1 z-50 min-w-[9rem]
    bg-white rounded-md shadow-lg border border-gray-200 py-1
  `,
  menuItemDanger: `
    w-full flex items-center gap-2 px-3 py-2 text-sm text-left
    text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  menuItemIcon: `h-3.5 w-3.5`,
};
