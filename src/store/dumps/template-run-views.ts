import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RenderPreview, TemplateDiffFile, TemplateFile } from '@/api/agent-runs';

/** Template PR views per `${runId}|${repo}` key (templateViewKey): diff (whole PR or this run's commit), render preview, file contents. */
type TemplateRunView = {
  diff: Partial<Record<'pr' | 'run', TemplateDiffFile[]>>;
  preview: RenderPreview | null;
  /** `${at}:${path}` → file */
  files: Record<string, TemplateFile>;
};
type TemplateRunViewsState = Record<string, TemplateRunView>;

const initialState: TemplateRunViewsState = {};

/** Key for one template repo's views within a run. */
export const templateViewKey = (runId: string, repo: string): string => `${runId}|${repo}`;
const empty = (): TemplateRunView => ({ diff: {}, preview: null, files: {} });

export const templateRunViewsSlice = createSlice({
  name: 'templateRunViews',
  initialState,
  reducers: {
    setDiff: (state, action: PayloadAction<{ key: string; scope: 'pr' | 'run'; files: TemplateDiffFile[] }>) => {
      state[action.payload.key] ??= empty();
      state[action.payload.key].diff[action.payload.scope] = action.payload.files;
    },
    setPreview: (state, action: PayloadAction<{ key: string; preview: RenderPreview }>) => {
      state[action.payload.key] ??= empty();
      state[action.payload.key].preview = action.payload.preview;
    },
    setFile: (state, action: PayloadAction<{ key: string; file: TemplateFile }>) => {
      state[action.payload.key] ??= empty();
      state[action.payload.key].files[`${action.payload.file.at}:${action.payload.file.path}`] = action.payload.file;
    },
    reset: () => initialState,
  },
});

export const TemplateRunViewsActions = templateRunViewsSlice.actions;
export const templateRunViewsReducer = templateRunViewsSlice.reducer;
