import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CustomerBuilderState = {
  isModalOpen: boolean;
};

const initialState: CustomerBuilderState = {
  isModalOpen: false,
};

export const customerBuilderSlice = createSlice({
  name: 'customerBuilder',
  initialState,
  reducers: {
    openCustomerModal: (state) => {
      state.isModalOpen = true;
    },
    closeCustomerModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const CustomerBuilderActions = customerBuilderSlice.actions;
export default customerBuilderSlice.reducer;
