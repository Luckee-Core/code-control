'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { detailPageStyles } from '@/components/detail-page-styles';
import { CONVENTIONS_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { DataModelBuilderActions } from '@/store/builders';
import { buildAnswerFeedback, readProposalQuestions, reviseDataModelProposalThunk } from '@/store/thunks/data-model-proposals';

/**
 * Product questions (pick an option; the proposal already implements the recommended one),
 * structural choices no convention covered, and tables deliberately left out.
 */
export const Notes = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const proposal = useAppSelector((state) => (selectedId ? state.dataModelProposals[selectedId] ?? null : null));
  const answers = useAppSelector((state) => state.dataModelBuilder.questionAnswers);
  const submitStatus = useAppSelector((state) => state.dataModelBuilder.submitStatus);

  const content = proposal?.proposal ?? null;
  const questions = useMemo(() => readProposalQuestions(content), [content]);
  const gaps = useMemo(() => content?.convention_gaps ?? [], [content]);
  const changedAnswers = useMemo(() => buildAnswerFeedback(questions, answers).length, [questions, answers]);
  const canRevise = proposal?.status === 'ready';

  if (!content || (questions.length === 0 && gaps.length === 0 && content.excluded.length === 0)) return null;

  return (
    <div className={styles.stack}>
      {questions.length > 0 ? (
        <section className={detailPageStyles.panel}>
          <div className={detailPageStyles.panelHeader}>
            <div>
              <h2 className={detailPageStyles.panelTitle}>Open questions</h2>
              <p className={detailPageStyles.panelSubtitle}>
                The tables above already use the recommended answers. Approve as is, or pick a different answer and revise.
              </p>
            </div>
          </div>
          <div className={`${detailPageStyles.panelBody} ${styles.questions}`}>
            {questions.map((question, index) => {
              const picked = answers[index] ?? question.recommended_option;
              return (
                <div key={index} className={styles.question}>
                  <p className={styles.questionText}>{question.question}</p>
                  {question.why_it_matters ? <p className={styles.why}>{question.why_it_matters}</p> : null}
                  {question.options.length > 0 ? (
                    <div className={styles.options}>
                      {question.options.map((option) => (
                        <label key={option.label} className={picked === option.label ? styles.optionOn : styles.option}>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            checked={picked === option.label}
                            disabled={!canRevise}
                            onChange={() => dispatch(DataModelBuilderActions.setQuestionAnswer({ index, label: option.label }))}
                            className={styles.radio}
                          />
                          <span>
                            <span className={styles.optionLabel}>{option.label}</span>
                            {option.label === question.recommended_option ? <span className={styles.recommended}>in this proposal</span> : null}
                            {option.schema_effect ? <span className={styles.effect}>{option.schema_effect}</span> : null}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.why}>Answer in the Revise box above.</p>
                  )}
                </div>
              );
            })}
            {canRevise ? (
              <div className={styles.footer}>
                <button
                  type="button"
                  onClick={() => void dispatch(reviseDataModelProposalThunk())}
                  disabled={changedAnswers === 0 || submitStatus === 'submitting'}
                  className={detailPageStyles.primaryButton}
                >
                  {submitStatus === 'submitting' ? 'Starting…' : changedAnswers === 0 ? 'No answers changed' : `Revise with ${changedAnswers} changed answer${changedAnswers === 1 ? '' : 's'}`}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {gaps.length > 0 || content.excluded.length > 0 ? (
        <section className={detailPageStyles.panel}>
          <div className={`${detailPageStyles.panelBody} ${styles.grid}`}>
            {gaps.length > 0 ? (
              <div>
                <h3 className={detailPageStyles.sectionTitle}>Decided without a convention</h3>
                <p className={styles.why}>
                  Structural choices no convention covered. Add the suggested rule on the{' '}
                  <Link href={CONVENTIONS_PATH} className={styles.link}>Conventions</Link> page so the next data model follows it.
                </p>
                <ul className={styles.list}>
                  {gaps.map((gap) => (
                    <li key={gap.topic} className={styles.item}>
                      <span className={styles.name}>{gap.topic}</span>: {gap.decision}
                      <span className={styles.suggestion}>Suggested convention: {gap.suggested_convention}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {content.excluded.length > 0 ? (
              <div>
                <h3 className={detailPageStyles.sectionTitle}>Left out on purpose</h3>
                <ul className={styles.list}>
                  {content.excluded.map((item) => (
                    <li key={item.name} className={styles.item}>
                      <span className={styles.name}>{item.name}</span>: {item.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
};

const styles = {
  stack: `flex flex-col gap-4`,
  questions: `flex flex-col gap-4`,
  question: `flex flex-col gap-1.5`,
  questionText: `text-xs font-semibold text-gray-900`,
  why: `text-xs text-gray-600`,
  options: `flex flex-col gap-1 mt-1`,
  option: `flex items-start gap-2 px-2 py-1.5 rounded border border-gray-200 bg-white cursor-pointer text-xs text-gray-800`,
  optionOn: `flex items-start gap-2 px-2 py-1.5 rounded border border-blue-400 bg-blue-50 cursor-pointer text-xs text-gray-900`,
  radio: `mt-0.5`,
  optionLabel: `font-medium`,
  recommended: `ml-2 text-[9px] uppercase font-semibold text-green-700`,
  effect: `block text-[11px] text-gray-600 mt-0.5`,
  footer: `flex justify-end`,
  grid: `grid grid-cols-1 md:grid-cols-2 gap-5`,
  list: `mt-2 flex flex-col gap-1.5 list-disc pl-4`,
  item: `text-xs text-gray-700 leading-relaxed`,
  name: `font-mono text-gray-900`,
  suggestion: `block text-[11px] text-gray-500 mt-0.5`,
  link: `text-blue-700 hover:underline`,
};
