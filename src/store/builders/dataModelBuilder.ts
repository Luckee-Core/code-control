import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DataModelGenerationQueue } from '@/model';

type DataModelQueueStatus = 'queued' | 'processing' | 'completed' | 'failed';

type SortColumn =
  | 'status'
  | 'project'
  | 'repo'
  | 'entity'
  | 'file_path'
  | 'scheduled_at'
  | 'started_at'
  | 'completed_at'
  | 'error';

type DataModelBuilderState = {
  selectedEntityIds: string[];
  isGenerating: boolean;
  filteredItems: DataModelGenerationQueue[];
  filterStatus: 'all' | DataModelQueueStatus;
  sortColumn: SortColumn;
  sortDirection: 'asc' | 'desc';
};

const initialState: DataModelBuilderState = {
  selectedEntityIds: [],
  isGenerating: false,
  filteredItems: [],
  filterStatus: 'all',
  sortColumn: 'scheduled_at',
  sortDirection: 'desc',
};

export const dataModelBuilderSlice = createSlice({
  name: 'dataModelBuilder',
  initialState,
  reducers: {
    toggleEntitySelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedEntityIds.indexOf(id);
      if (index === -1) {
        state.selectedEntityIds.push(id);
      } else {
        state.selectedEntityIds.splice(index, 1);
      }
    },
    setSelectedEntityIds: (state, action: PayloadAction<string[]>) => {
      state.selectedEntityIds = action.payload;
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setFilteredItems: (state, action: PayloadAction<DataModelGenerationQueue[]>) => {
      state.filteredItems = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<'all' | DataModelQueueStatus>) => {
      state.filterStatus = action.payload;
    },
    setSortColumn: (state, action: PayloadAction<SortColumn>) => {
      state.sortColumn = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortDirection = action.payload;
    },
    reset: () => initialState,
  },
});

export const DataModelBuilderActions = dataModelBuilderSlice.actions;
export default dataModelBuilderSlice.reducer;
