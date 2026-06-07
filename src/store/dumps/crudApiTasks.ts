import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CrudApiTask = {
  id: string;
  name: string;
  task_type: string;
  description: string | null;
  prompt_template: string;
  output_path_template: string;
  operation_key: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const crudApiTasksSlice = createSlice({
  name: 'crudApiTasks',
  initialState: [] as CrudApiTask[],
  reducers: {
    setCrudApiTasks: (state, action: PayloadAction<CrudApiTask[]>) => action.payload,
  },
});

export const CrudApiTasksActions = crudApiTasksSlice.actions;
