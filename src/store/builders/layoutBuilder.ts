import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type LayoutBuilderState = {
  isSidebarOpen: boolean;
  breadcrumbs: BreadcrumbItem[];
};

const initialState: LayoutBuilderState = {
  isSidebarOpen: true,
  breadcrumbs: [],
};

const layoutBuilderSlice = createSlice({
  name: 'layoutBuilder',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
    reset: () => initialState,
  },
});

export const LayoutBuilderActions = layoutBuilderSlice.actions;
export default layoutBuilderSlice.reducer;
