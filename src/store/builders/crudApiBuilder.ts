/**
 * CRUD API Builder Slice
 * 
 * Manages state for CRUD API phase:
 * - Entity selection (pills)
 * - Per-entity operation selection
 * - Dropdown expansion state
 * - Generation state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CrudApiBuilderState = {
  /** Selected entity IDs (pill checkboxes) */
  selectedEntityIds: string[];
  
  /** Per-entity operation selections: entityId -> operation keys */
  entityOperationSelections: Record<string, string[]>;
  
  /** Currently expanded entity dropdown (only one at a time) */
  expandedEntityId: string | null;
  
  /** Loading state during generation */
  isGenerating: boolean;
  
  /** Selected queue item IDs in the queue table (for retry/delete) */
  selectedCrudApiQueueItemIds: string[];
};

const initialState: CrudApiBuilderState = {
  selectedEntityIds: [],
  entityOperationSelections: {},
  expandedEntityId: null,
  isGenerating: false,
  selectedCrudApiQueueItemIds: [],
};

const crudApiBuilderSlice = createSlice({
  name: 'crudApiBuilder',
  initialState,
  reducers: {
    /**
     * Toggle entity selection (pill checkbox)
     * If selecting, pre-populate with base operations
     */
    toggleEntitySelection: (state, action: PayloadAction<{ entityId: string; baseOperationKeys: string[] }>) => {
      const { entityId, baseOperationKeys } = action.payload;
      const index = state.selectedEntityIds.indexOf(entityId);
      
      if (index === -1) {
        // Select entity
        state.selectedEntityIds.push(entityId);
        // Pre-populate with base operations if not already set
        if (!state.entityOperationSelections[entityId]) {
          state.entityOperationSelections[entityId] = [...baseOperationKeys];
        }
      } else {
        // Deselect entity
        state.selectedEntityIds.splice(index, 1);
      }
    },

    /**
     * Toggle a specific operation for an entity
     */
    toggleOperationSelection: (state, action: PayloadAction<{ entityId: string; operationKey: string }>) => {
      const { entityId, operationKey } = action.payload;
      
      if (!state.entityOperationSelections[entityId]) {
        state.entityOperationSelections[entityId] = [];
      }
      
      const operations = state.entityOperationSelections[entityId];
      const index = operations.indexOf(operationKey);
      
      if (index === -1) {
        operations.push(operationKey);
      } else {
        operations.splice(index, 1);
      }
    },

    /**
     * Set which entity dropdown is expanded (null to close all)
     */
    setExpandedEntity: (state, action: PayloadAction<string | null>) => {
      state.expandedEntityId = action.payload;
    },

    /**
     * Toggle expanded entity (close if already open, open if closed)
     */
    toggleExpandedEntity: (state, action: PayloadAction<string>) => {
      if (state.expandedEntityId === action.payload) {
        state.expandedEntityId = null;
      } else {
        state.expandedEntityId = action.payload;
      }
    },

    /**
     * Set generating state
     */
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },

    /**
     * Clear all selections (after successful generation)
     */
    clearSelections: (state) => {
      state.selectedEntityIds = [];
      state.entityOperationSelections = {};
      state.expandedEntityId = null;
    },

    /**
     * Set all operations for an entity (used for select all in category)
     */
    setEntityOperations: (state, action: PayloadAction<{ entityId: string; operationKeys: string[] }>) => {
      const { entityId, operationKeys } = action.payload;
      state.entityOperationSelections[entityId] = operationKeys;
    },

    /**
     * Toggle queue item selection (table checkboxes)
     */
    toggleCrudApiQueueItemSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedCrudApiQueueItemIds.indexOf(id);
      if (index === -1) {
        state.selectedCrudApiQueueItemIds.push(id);
      } else {
        state.selectedCrudApiQueueItemIds.splice(index, 1);
      }
    },

    /**
     * Set selected queue item IDs (e.g. select all)
     */
    setSelectedCrudApiQueueItemIds: (state, action: PayloadAction<string[]>) => {
      state.selectedCrudApiQueueItemIds = action.payload;
    },

    /**
     * Clear selected queue items
     */
    clearSelectedCrudApiQueueItemIds: (state) => {
      state.selectedCrudApiQueueItemIds = [];
    },
  },
});

export const CrudApiBuilderActions = crudApiBuilderSlice.actions;
export const crudApiBuilderReducer = crudApiBuilderSlice.reducer;
