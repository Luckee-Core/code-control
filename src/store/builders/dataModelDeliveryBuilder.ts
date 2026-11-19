import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Status = 'idle' | 'loading' | 'error';

type DataModelDeliveryBuilderState = {
  loadStatus: Status;
  loadError: string | null;
  /** Role being delivered ('' when idle; 'all' for every role). */
  deliveringRole: string;
  deliverError: string | null;
  /** Role whose preview is open ('' when closed). */
  previewRole: string;
  /** Squash-merge each PR right after opening it. */
  autoMerge: boolean;
  previewStatus: Status;
  previewError: string | null;
  selectedPath: string;
};

const initialState: DataModelDeliveryBuilderState = {
  loadStatus: 'idle',
  loadError: null,
  deliveringRole: '',
  deliverError: null,
  previewRole: '',
  autoMerge: false,
  previewStatus: 'idle',
  previewError: null,
  selectedPath: '',
};

const dataModelDeliveryBuilderSlice = createSlice({
  name: 'dataModelDeliveryBuilder',
  initialState,
  reducers: {
    setLoad: (state, action: PayloadAction<{ status: Status; error?: string | null }>) => {
      state.loadStatus = action.payload.status;
      state.loadError = action.payload.error ?? null;
    },
    setDelivering: (state, action: PayloadAction<{ role: string; error?: string | null }>) => {
      state.deliveringRole = action.payload.role;
      state.deliverError = action.payload.error ?? null;
    },
    openPreview: (state, action: PayloadAction<string>) => {
      state.previewRole = action.payload;
      state.previewStatus = 'loading';
      state.previewError = null;
      state.selectedPath = '';
    },
    setPreviewStatus: (state, action: PayloadAction<{ status: Status; error?: string | null }>) => {
      state.previewStatus = action.payload.status;
      state.previewError = action.payload.error ?? null;
    },
    setAutoMerge: (state, action: PayloadAction<boolean>) => {
      state.autoMerge = action.payload;
    },
    selectPath: (state, action: PayloadAction<string>) => {
      state.selectedPath = action.payload;
    },
    closePreview: (state) => {
      state.previewRole = '';
      state.previewStatus = 'idle';
      state.previewError = null;
      state.selectedPath = '';
    },
    reset: (state) => ({ ...initialState, autoMerge: state.autoMerge }),
  },
});

export const DataModelDeliveryBuilderActions = dataModelDeliveryBuilderSlice.actions;
export const dataModelDeliveryBuilderReducer = dataModelDeliveryBuilderSlice.reducer;
