import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WorkspaceTabId = 'step' | 'conventions' | 'examples';
export type WorkspaceViewId =
  | 'details'
  | 'data'
  | 'build'
  | 'project-setup';

type SelectedEntityOperations = Record<string, string[]>;

type ProjectBuilderState = {
  activeProjectId: string | null;
  activeStageId: string | null;
  activeStepId: string | null;
  isWorkspaceOpen: boolean;
  workspaceTab: WorkspaceTabId;
  expandedStageIds: string[];
  expandedWorkspaceSectionIds: string[];
  activeWorkspaceView: WorkspaceViewId;
  /** Repo IDs with dropdowns expanded in the guided pathway sidebar (multiple can be open) */
  openReposInWorkspace: string[];
  /** Repo whose phase content is displayed in the main content area */
  activeGuidedRepoId: string | null;
  activeGuidedPhaseId: string | null;
  selectedEntityOperations: SelectedEntityOperations;
  isProjectModalOpen: boolean;
  editingProjectId: string | null;
  isStageModalOpen: boolean;
  editingStageId: string | null;
  isStepModalOpen: boolean;
  editingStepId: string | null;
  /** Selected entity ID in the Data tab - persists across navigation */
  selectedDataEntityId: string | null;
  /** SQL preview panel collapse state in Data tab */
  isSqlPreviewCollapsed: boolean;
};

const initialState: ProjectBuilderState = {
  activeProjectId: null,
  activeStageId: null,
  activeStepId: null,
  isWorkspaceOpen: false,
  workspaceTab: 'step',
  expandedStageIds: [],
  expandedWorkspaceSectionIds: [],
  activeWorkspaceView: 'details',
  openReposInWorkspace: [],
  activeGuidedRepoId: null,
  activeGuidedPhaseId: null,
  selectedEntityOperations: {},
  isProjectModalOpen: false,
  editingProjectId: null,
  isStageModalOpen: false,
  editingStageId: null,
  isStepModalOpen: false,
  editingStepId: null,
  selectedDataEntityId: null,
  isSqlPreviewCollapsed: false,
};

const projectBuilderSlice = createSlice({
  name: 'projectBuilder',
  initialState,
  reducers: {
    setActiveProjectId: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
      state.activeStageId = null;
    },
    setActiveStageId: (state, action: PayloadAction<string | null>) => {
      state.activeStageId = action.payload;
    },
    setActiveStepId: (state, action: PayloadAction<string | null>) => {
      state.activeStepId = action.payload;
    },
    openWorkspace: (state) => {
      state.isWorkspaceOpen = true;
    },
    closeWorkspace: (state) => {
      state.isWorkspaceOpen = false;
      state.activeStepId = null;
      state.expandedStageIds = [];
    },
    setWorkspaceTab: (state, action: PayloadAction<WorkspaceTabId>) => {
      state.workspaceTab = action.payload;
    },
    setActiveWorkspaceView: (state, action: PayloadAction<WorkspaceViewId>) => {
      state.activeWorkspaceView = action.payload;
    },
    setOpenReposInWorkspace: (state, action: PayloadAction<string[]>) => {
      state.openReposInWorkspace = action.payload;
    },
    toggleOpenRepo: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const i = state.openReposInWorkspace.indexOf(id);
      if (i === -1) state.openReposInWorkspace.push(id);
      else state.openReposInWorkspace.splice(i, 1);
    },
    setActiveGuidedRepoId: (state, action: PayloadAction<string | null>) => {
      state.activeGuidedRepoId = action.payload;
    },
    setActiveGuidedPhaseId: (state, action: PayloadAction<string | null>) => {
      state.activeGuidedPhaseId = action.payload;
    },
    toggleWorkspaceSectionExpanded: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const i = state.expandedWorkspaceSectionIds.indexOf(id);
      if (i === -1) state.expandedWorkspaceSectionIds.push(id);
      else state.expandedWorkspaceSectionIds.splice(i, 1);
    },
    toggleEntityOperation: (
      state,
      action: PayloadAction<{ entityId: string; operationKey: string }>
    ) => {
      const { entityId, operationKey } = action.payload;
      const list = state.selectedEntityOperations[entityId] ?? [];
      const i = list.indexOf(operationKey);
      if (i === -1) {
        state.selectedEntityOperations[entityId] = [...list, operationKey];
      } else {
        const next = [...list];
        next.splice(i, 1);
        state.selectedEntityOperations[entityId] = next;
      }
    },
    setSelectedEntityOperations: (
      state,
      action: PayloadAction<SelectedEntityOperations>
    ) => {
      state.selectedEntityOperations = action.payload;
    },
    setEntityOperations: (
      state,
      action: PayloadAction<{ entityId: string; operationKeys: string[] }>
    ) => {
      const { entityId, operationKeys } = action.payload;
      state.selectedEntityOperations[entityId] = operationKeys;
    },
    toggleStageExpanded: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const i = state.expandedStageIds.indexOf(id);
      if (i === -1) state.expandedStageIds.push(id);
      else state.expandedStageIds.splice(i, 1);
    },
    openProjectModal: (state, action: PayloadAction<string | null>) => {
      state.isProjectModalOpen = true;
      state.editingProjectId = action.payload;
    },
    closeProjectModal: (state) => {
      state.isProjectModalOpen = false;
      state.editingProjectId = null;
    },
    openStageModal: (state, action: PayloadAction<string | null>) => {
      state.isStageModalOpen = true;
      state.editingStageId = action.payload;
    },
    closeStageModal: (state) => {
      state.isStageModalOpen = false;
      state.editingStageId = null;
    },
    openStepModal: (state, action: PayloadAction<string | null>) => {
      state.isStepModalOpen = true;
      state.editingStepId = action.payload;
    },
    closeStepModal: (state) => {
      state.isStepModalOpen = false;
      state.editingStepId = null;
    },
    setSelectedDataEntityId: (state, action: PayloadAction<string | null>) => {
      state.selectedDataEntityId = action.payload;
    },
    toggleSqlPreviewCollapsed: (state) => {
      state.isSqlPreviewCollapsed = !state.isSqlPreviewCollapsed;
    },
    reset: () => initialState,
  },
});

export const WorkspaceBuilderActions = projectBuilderSlice.actions;
export default projectBuilderSlice.reducer;
