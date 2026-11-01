import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SoftwareSystem } from '@/model/software-system';

const initialState: SoftwareSystem = {
  id: '',
  customer_id: '',
  name: '',
  description: null,
  created_at: '',
  updated_at: '',
};

export const currentSoftwareSystemSlice = createSlice({
  name: 'currentSoftwareSystem',
  initialState,
  reducers: {
    setSoftwareSystem: (_state, action: PayloadAction<SoftwareSystem>) => action.payload,
    updateSoftwareSystemFields: (state, action: PayloadAction<Partial<SoftwareSystem>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentSoftwareSystemActions = currentSoftwareSystemSlice.actions;
export const currentSoftwareSystemReducer = currentSoftwareSystemSlice.reducer;
