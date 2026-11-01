'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentCustomerActions } from '@/store/current';
import { deleteCustomerThunk } from '@/store/thunks/customers';
import { CUSTOMERS_PATH } from '@/config/routes';

/**
 * Ellipsis menu for customer detail header (delete in My Ops CRM).
 */
export const ActionsMenu = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.currentCustomer);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 144;
    const left = Math.max(8, rect.right - menuWidth);
    const top = rect.bottom + 4;
    setMenuPosition({ top, left });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(false);

    if (!customer.id || isDeleting) return;
    if (!confirm(`Delete customer "${customer.name}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    const result = await dispatch(deleteCustomerThunk(customer.id));
    setIsDeleting(false);

    if (result.status === 200) {
      dispatch(CurrentCustomerActions.reset());
      router.push(CUSTOMERS_PATH);
      return;
    }

    window.alert(result.error ?? 'Failed to delete customer');
  };

  const menu =
    isOpen && menuPosition && typeof document !== 'undefined'
      ? createPortal(
          <>
            <button
              type="button"
              className={styles.backdrop}
              aria-label="Close menu"
              onClick={(event) => {
                event.stopPropagation();
                setIsOpen(false);
              }}
            />
            <div
              ref={menuRef}
              className={styles.menu}
              role="menu"
              style={{ top: menuPosition.top, left: menuPosition.left }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={(event) => void handleDelete(event)}
                className={styles.menuItemDanger}
                role="menuitem"
                disabled={isDeleting}
              >
                <Trash2 className={styles.menuItemIcon} />
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </>,
          document.body,
        )
      : null;

  if (!customer.id) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={styles.trigger}
        aria-label={`Actions for ${customer.name}`}
        aria-expanded={isOpen}
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
  container: `
    relative flex justify-end overflow-visible shrink-0
  `,
  trigger: `
    p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100
    border-none bg-transparent cursor-pointer transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  icon: `
    h-5 w-5
  `,
  backdrop: `
    fixed inset-0 z-[60] cursor-default bg-transparent border-none
  `,
  menu: `
    fixed z-[70] min-w-[9rem] max-h-60 overflow-y-auto overflow-x-hidden
    bg-white rounded-md shadow-lg border border-gray-300 py-1
  `,
  menuItemDanger: `
    w-full flex items-center gap-2 px-3 py-2 text-xs text-left
    text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  menuItemIcon: `
    h-3.5 w-3.5
  `,
};
