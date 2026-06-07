import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '@/model/customer';

type InitialState = {
  [key: string]: Customer;
};

const initialState: InitialState = {};

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      action.payload.forEach((customer) => {
        state[customer.id] = customer;
      });
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state[action.payload.id] = action.payload;
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      state[action.payload.id] = action.payload;
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const CustomersActions = customersSlice.actions;
export const customersReducer = customersSlice.reducer;
export default customersSlice.reducer;
