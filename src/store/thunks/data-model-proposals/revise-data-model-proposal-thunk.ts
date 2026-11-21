import { reviseDataModelProposal } from '@/api/data-model-proposals';
import { DataModelBuilderActions } from '../../builders';
import { DataModelProposalsActions } from '../../dumps';
import type { AppThunk } from '../../types';
import { buildAnswerFeedback, readProposalQuestions } from './proposal-questions';

/**
 * Starts the next version from the selected proposal: answers that differ from the recommended
 * option, plus the feedback box.
 */
export const reviseDataModelProposalThunk = (): AppThunk<Promise<202 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { selectedProposalId, feedbackDraft, questionAnswers } = getState().dataModelBuilder;
    const content = selectedProposalId ? getState().dataModelProposals[selectedProposalId]?.proposal : null;
    const answerLines = buildAnswerFeedback(readProposalQuestions(content), questionAnswers);
    const feedback = [
      ...(answerLines.length > 0 ? ['Answers to the open questions (change the tables to match):', ...answerLines] : []),
      ...(feedbackDraft.trim() ? [answerLines.length > 0 ? '' : null, feedbackDraft.trim()].filter((line): line is string => line !== null) : []),
    ].join('\n').trim();
    if (!selectedProposalId || !feedback) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: 'Pick a different answer or write what should change' }));
      return 400;
    }

    dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await reviseDataModelProposal(selectedProposalId, feedback);
    if (!response.success || !response.data) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not revise' }));
      return 500;
    }
    dispatch(DataModelProposalsActions.upsertDataModelProposal(response.data));
    dispatch(DataModelBuilderActions.selectProposal(response.data.id));
    return 202;
  };
};
