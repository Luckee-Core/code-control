export type JobQuestionType = 'single_choice' | 'true_false' | 'open_ended';

export type QuestionChoice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type JobQuestionOptions = QuestionChoice[] | Record<string, unknown> | null;

export type JobQuestion = {
  id: string;
  jobId: string;
  type: JobQuestionType;
  question: string;
  explanation: string | null;
  options: JobQuestionOptions;
  correctAnswer: boolean | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};
