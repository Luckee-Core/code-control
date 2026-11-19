import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SetupPreset } from '@/model/setup-preset';

/** Active project types keyed by setup_presets.key. */
type SetupPresetsState = Record<string, SetupPreset>;

const initialState: SetupPresetsState = {};

export const setupPresetsSlice = createSlice({
  name: 'setupPresets',
  initialState,
  reducers: {
    setSetupPresets: (_state, action: PayloadAction<SetupPreset[]>) =>
      Object.fromEntries(action.payload.map((preset) => [preset.key, preset])),
    reset: () => initialState,
  },
});

export const SetupPresetsActions = setupPresetsSlice.actions;
export const setupPresetsReducer = setupPresetsSlice.reducer;
