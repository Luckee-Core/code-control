import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ARDTask } from '@/model';

const initialState: ARDTask[] = [];

export const ardTasksSlice = createSlice({
  name: 'ardTasks',
  initialState,
  reducers: {
    setARDTasks: (state, action: PayloadAction<ARDTask[]>) => {
      return action.payload;
    },
    addARDTask: (state, action: PayloadAction<ARDTask>) => {
      state.push(action.payload);
    },
    updateARDTask: (state, action: PayloadAction<ARDTask>) => {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteARDTask: (state, action: PayloadAction<string>) => {
      return state.filter((t) => t.id !== action.payload);
    },
  },
});

export const ARDTasksActions = ardTasksSlice.actions;
export const ardTasksReducer = ardTasksSlice.reducer;
