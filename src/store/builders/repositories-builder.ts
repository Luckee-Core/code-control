import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoadStatus = 'idle' | 'loading' | 'error';
type SaveStatus = 'idle' | 'saving' | 'error';
type ExistingRepoType = 'express' | 'python' | 'nextjs';
export type ServerRuntime = 'express' | 'python';

type RepositoriesBuilderState = {
  isExpressCreateOpen: boolean;
  isWebCreateOpen: boolean;
  isAddExistingOpen: boolean;
  serverRuntime: ServerRuntime;
  expressRepoName: string;
  webRepoName: string;
  existingRepoUrl: string;
  existingRepoType: ExistingRepoType;
  selectedGithubOrg: string;
  githubOrgOptions: string[];
  githubSetupError: string;
  linkError: string;
  listLoadStatus: LoadStatus;
  saveStatus: SaveStatus;
};

const initialState: RepositoriesBuilderState = {
  isExpressCreateOpen: false,
  isWebCreateOpen: false,
  isAddExistingOpen: false,
  serverRuntime: 'express',
  expressRepoName: '',
  webRepoName: '',
  existingRepoUrl: '',
  existingRepoType: 'express',
  selectedGithubOrg: '',
  githubOrgOptions: [],
  githubSetupError: '',
  linkError: '',
  listLoadStatus: 'idle',
  saveStatus: 'idle',
};

const repositoriesBuilderSlice = createSlice({
  name: 'repositoriesBuilder',
  initialState,
  reducers: {
    openExpressCreate: (state) => {
      state.isExpressCreateOpen = true;
      state.serverRuntime = 'express';
      state.saveStatus = 'idle';
    },
    closeExpressCreate: (state) => {
      state.isExpressCreateOpen = false;
      state.serverRuntime = 'express';
      state.expressRepoName = '';
      state.saveStatus = 'idle';
    },
    openWebCreate: (state) => {
      state.isWebCreateOpen = true;
      state.saveStatus = 'idle';
    },
    closeWebCreate: (state) => {
      state.isWebCreateOpen = false;
      state.webRepoName = '';
      state.saveStatus = 'idle';
    },
    openAddExisting: (state) => {
      state.isAddExistingOpen = true;
      state.existingRepoType = 'nextjs';
      state.linkError = '';
      state.saveStatus = 'idle';
    },
    closeAddExisting: (state) => {
      state.isAddExistingOpen = false;
      state.existingRepoUrl = '';
      state.existingRepoType = 'express';
      state.linkError = '';
      state.saveStatus = 'idle';
    },
    setServerRuntime: (state, action: PayloadAction<ServerRuntime>) => {
      state.serverRuntime = action.payload;
    },
    setExpressRepoName: (state, action: PayloadAction<string>) => {
      state.expressRepoName = action.payload;
    },
    setWebRepoName: (state, action: PayloadAction<string>) => {
      state.webRepoName = action.payload;
    },
    setExistingRepoUrl: (state, action: PayloadAction<string>) => {
      state.existingRepoUrl = action.payload;
    },
    setExistingRepoType: (state, action: PayloadAction<ExistingRepoType>) => {
      state.existingRepoType = action.payload;
    },
    setSelectedGithubOrg: (state, action: PayloadAction<string>) => {
      state.selectedGithubOrg = action.payload;
    },
    setGithubOrgOptions: (state, action: PayloadAction<string[]>) => {
      state.githubOrgOptions = action.payload;
    },
    setGithubSetupError: (state, action: PayloadAction<string>) => {
      state.githubSetupError = action.payload;
    },
    setLinkError: (state, action: PayloadAction<string>) => {
      state.linkError = action.payload;
    },
    setListLoadStatus: (state, action: PayloadAction<LoadStatus>) => {
      state.listLoadStatus = action.payload;
    },
    setSaveStatus: (state, action: PayloadAction<SaveStatus>) => {
      state.saveStatus = action.payload;
    },
    reset: () => initialState,
  },
});

export const RepositoriesBuilderActions = repositoriesBuilderSlice.actions;
export const repositoriesBuilderReducer = repositoriesBuilderSlice.reducer;
