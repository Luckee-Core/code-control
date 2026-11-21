import type { DataModelProposalContent, ProposalQuestion } from '@/model/data-model-proposal';

/** Open questions of a proposal; older proposals stored plain strings (no options). */
export const readProposalQuestions = (content: DataModelProposalContent | null | undefined): ProposalQuestion[] =>
  (content?.open_questions ?? []).map((raw: ProposalQuestion | string) =>
    typeof raw === 'string' ? { question: raw, why_it_matters: '', options: [], recommended_option: '' } : raw,
  );

/**
 * Revision feedback lines for the answers that differ from the recommended option (the proposal
 * already implements the recommended ones). [] when every answer is the recommendation.
 */
export const buildAnswerFeedback = (questions: ProposalQuestion[], answers: Record<number, string>): string[] =>
  questions.flatMap((question, index) => {
    const picked = answers[index];
    if (!picked || picked === question.recommended_option) return [];
    const option = question.options.find((item) => item.label === picked);
    return [`- ${question.question} → ${picked}${option?.schema_effect ? ` (${option.schema_effect})` : ''}`];
  });
