import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SoftwareSystemTab =
  | 'Repositories'
  | 'Data model'
  | 'API'
  | 'Layout'
  | 'Tables'
  | 'Detail pages'
  | 'Dashboard'
  | 'Dispatcher'
  | 'Ticket builds'
  | 'AI costs';

/** Software system detail page: the open tab (in Redux so Build all can open a step's tab). */
type SoftwareSystemTabsBuilderState = {
  activeTab: SoftwareSystemTab;
};

const initialState: SoftwareSystemTabsBuilderState = {
  activeTab: 'Repositories',
};

const softwareSystemTabsBuilderSlice = createSlice({
  name: 'softwareSystemTabsBuilder',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<SoftwareSystemTab>) => {
      state.activeTab = action.payload;
    },
    reset: () => initialState,
  },
});

export const SoftwareSystemTabsBuilderActions = softwareSystemTabsBuilderSlice.actions;
export const softwareSystemTabsBuilderReducer = softwareSystemTabsBuilderSlice.reducer;
