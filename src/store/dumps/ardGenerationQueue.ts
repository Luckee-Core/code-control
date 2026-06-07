import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ARDGenerationTask } from '@/model';

const initialState: ARDGenerationTask[] = [];

export const ardGenerationQueueSlice = createSlice({
  name: 'ardGenerationQueue',
  initialState,
  reducers: {
    setARDGenerationQueue: (state, action: PayloadAction<ARDGenerationTask[]>) => {
      return action.payload;
    },
    addARDGenerationTask: (state, action: PayloadAction<ARDGenerationTask>) => {
      state.push(action.payload);
    },
    updateARDGenerationTask: (state, action: PayloadAction<ARDGenerationTask>) => {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteARDGenerationTask: (state, action: PayloadAction<string>) => {
      return state.filter((t) => t.id !== action.payload);
    },
  },
});

export const ARDGenerationQueueActions = ardGenerationQueueSlice.actions;
export const ardGenerationQueueReducer = ardGenerationQueueSlice.reducer;
