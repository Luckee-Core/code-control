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
            ✕
          </button>
        </div>
        <NameInput />
        <div className={styles.buttons}>
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
    fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4
  `,
  modal: `
    bg-white rounded-lg shadow-xl max-w-md w-full p-6
  `,
  header: `
    flex items-center justify-between mb-4
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  closeButton: `
    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700
    rounded border-none bg-transparent cursor-pointer
  `,
  buttons: `
    flex justify-end gap-2 mt-4
  `,
  cancelButton: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 cursor-pointer
  `,
  saveButton: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded
    hover:bg-blue-700 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
