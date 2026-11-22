'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentSoftwareSystemActions } from '@/store/current';
import { deleteSoftwareSystemThunk, openEditSoftwareSystemThunk } from '@/store/thunks/software-systems';
import { SOFTWARE_SYSTEMS_PATH } from '@/config/routes';

const MENU_WIDTH = 160;

/** Ellipsis menu on the software system's top card: Edit (name, description, type) and Delete. */
export const ActionsMenu = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const system = useAppSelector((state) => state.currentSoftwareSystem);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!menuPosition) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setMenuPosition(null);
    };
    // Fixed to the viewport: close on scroll or resize instead of blocking them.
    const close = () => setMenuPosition(null);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [menuPosition]);

  const handleToggle = () => {
    if (menuPosition || !triggerRef.current) {
      setMenuPosition(null);
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 4, left: Math.max(8, rect.right - MENU_WIDTH) });
  };

  const handleEdit = () => {
    setMenuPosition(null);
    dispatch(openEditSoftwareSystemThunk());
  };

  const handleDelete = async () => {
    setMenuPosition(null);
    if (!system.id || isDeleting) return;
    if (!confirm(`Delete software system "${system.name}"? Its GitHub repos are not deleted. This cannot be undone.`)) return;
    setIsDeleting(true);
    const result = await dispatch(deleteSoftwareSystemThunk(system.id));
    setIsDeleting(false);
    if (result === 200) {
      dispatch(CurrentSoftwareSystemActions.reset());
      router.push(SOFTWARE_SYSTEMS_PATH);
      return;
    }
    window.alert('Failed to delete software system');
  };

  const menu =
    menuPosition && typeof document !== 'undefined'
      ? createPortal(
          <div ref={menuRef} className={styles.menu} role="menu" style={{ top: menuPosition.top, left: menuPosition.left, width: MENU_WIDTH }}>
            <button type="button" role="menuitem" onClick={handleEdit} className={styles.menuItem}>
              <Pencil className={styles.menuItemIcon} />
              Edit
            </button>
            <button type="button" role="menuitem" onClick={() => void handleDelete()} className={styles.menuItemDanger} disabled={isDeleting}>
              <Trash2 className={styles.menuItemIcon} />
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>,
          document.body,
        )
      : null;

  if (!system.id) return null;

  return (
    <div className={styles.container}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={styles.trigger}
        aria-label={`Actions for ${system.name}`}
        aria-expanded={Boolean(menuPosition)}
        aria-haspopup="menu"
        disabled={isDeleting}
      >
        <MoreVertical className={styles.icon} />
      </button>
      {menu}
    </div>
  );
};

const styles = {
  container: `relative flex justify-end overflow-visible shrink-0`,
  trigger: `
    p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100
    border-none bg-transparent cursor-pointer transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  icon: `h-5 w-5`,
  menu: `
    fixed z-[70] overflow-hidden
    bg-white rounded-md shadow-lg border border-gray-300 py-1
  `,
  menuItem: `
    w-full flex items-center gap-2 px-3 py-2 text-xs text-left
    text-gray-700 hover:bg-gray-50 border-none bg-transparent cursor-pointer
  `,
  menuItemDanger: `
    w-full flex items-center gap-2 px-3 py-2 text-xs text-left
    text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  menuItemIcon: `h-3.5 w-3.5 shrink-0`,
};
