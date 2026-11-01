import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SoftwareSystem } from '@/model/software-system';

type SoftwareSystemsState = Record<string, SoftwareSystem>;

const initialState: SoftwareSystemsState = {};

export const softwareSystemsSlice = createSlice({
  name: 'softwareSystems',
  initialState,
  reducers: {
    setSoftwareSystems: (_state, action: PayloadAction<SoftwareSystem[]>) => {
      const next: SoftwareSystemsState = {};
      action.payload.forEach((system) => {
        next[system.id] = system;
      });
      return next;
    },
    addSoftwareSystem: (state, action: PayloadAction<SoftwareSystem>) => {
      state[action.payload.id] = action.payload;
    },
    updateSoftwareSystem: (state, action: PayloadAction<SoftwareSystem>) => {
      state[action.payload.id] = action.payload;
    },
    deleteSoftwareSystem: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const SoftwareSystemsActions = softwareSystemsSlice.actions;
export const softwareSystemsReducer = softwareSystemsSlice.reducer;
