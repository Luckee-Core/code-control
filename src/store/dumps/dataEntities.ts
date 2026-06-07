import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DataEntityWithFields } from '@/model/data-entity';

const initialState: DataEntityWithFields[] = [];

export const dataEntitiesSlice = createSlice({
  name: 'dataEntities',
  initialState,
  reducers: {
    setDataEntities: (_state, action: PayloadAction<DataEntityWithFields[]>) =>
      action.payload,
    addDataEntity: (state, action: PayloadAction<DataEntityWithFields>) => {
      state.push(action.payload);
    },
    updateDataEntity: (state, action: PayloadAction<DataEntityWithFields>) => {
      const i = state.findIndex((e) => e.id === action.payload.id);
      if (i !== -1) state[i] = action.payload;
    },
    addFieldToEntity: (
      state,
      action: PayloadAction<{ entityId: string; field: DataEntityWithFields['fields'][0] }>
    ) => {
      const entity = state.find((e) => e.id === action.payload.entityId);
      if (entity) {
        entity.fields = entity.fields || [];
        entity.fields.push(action.payload.field);
      }
    },
    updateFieldInEntity: (
      state,
      action: PayloadAction<{ entityId: string; field: DataEntityWithFields['fields'][0] }>
    ) => {
      const entity = state.find((e) => e.id === action.payload.entityId);
      if (entity?.fields) {
        const i = entity.fields.findIndex((f) => f.id === action.payload.field.id);
        if (i !== -1) entity.fields[i] = action.payload.field;
      }
    },
    removeFieldFromEntity: (
      state,
      action: PayloadAction<{ entityId: string; fieldId: string }>
    ) => {
      const entity = state.find((e) => e.id === action.payload.entityId);
      if (entity?.fields) {
        entity.fields = entity.fields.filter((f) => f.id !== action.payload.fieldId);
      }
    },
    deleteDataEntity: (state, action: PayloadAction<string>) => {
      return state.filter((e) => e.id !== action.payload);
    },
    reset: () => initialState,
  },
});

export const DataEntitiesActions = dataEntitiesSlice.actions;
export const dataEntitiesReducer = dataEntitiesSlice.reducer;
export default dataEntitiesSlice.reducer;
