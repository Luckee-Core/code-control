'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CustomerBuilderActions } from '@/store/builders';
import { CurrentCustomerActions } from '@/store/current';
import { createCustomerThunk } from '@/store/thunks/customers';
import { NameInput } from './inputs/name';

export const FormModal = () => {
  const dispatch = useAppDispatch();
  const customerBuilder = useAppSelector((state) => state.customerBuilder);
  const current = useAppSelector((state) => state.currentCustomer);

  const handleClose = () => {
    dispatch(CustomerBuilderActions.closeCustomerModal());
    dispatch(CurrentCustomerActions.reset());
  };

  const handleSave = async () => {
    if (!current.name.trim()) return;
    await dispatch(createCustomerThunk());
  };

  if (!customerBuilder.isModalOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Customer</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          <NameInput />
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            className={styles.saveButton}
            disabled={!current.name.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
  `,
  modal: `
    bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-300 overflow-hidden text-gray-900
  `,
  header: `
    flex items-center justify-between px-6 py-4 border-b border-gray-300
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  closeButton: `
    text-2xl text-gray-400 hover:text-gray-600 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  content: `
    px-6 py-4
  `,
  footer: `
    flex justify-end gap-2 px-6 py-4 border-t border-gray-300
  `,
  cancelButton: `
    px-4 py-2 rounded border border-gray-300 text-gray-700 cursor-pointer
    hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `,
  saveButton: `
    px-4 py-2 rounded bg-blue-600 text-white font-medium cursor-pointer
    hover:bg-blue-700 transition-colors border-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
