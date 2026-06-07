export type ContentPathStepType = 'data' | 'body' | 'questions' | 'publish';

export type ContentPathStep = {
  id: string;
  type: ContentPathStepType;
  label: string;
};
