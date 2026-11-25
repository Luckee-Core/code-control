import type { DataModelProposal } from '@/model/data-model-proposal';

/**
 * Downloads one data-model proposal version as a JSON file: the proposed tables and columns,
 * exclusions, open questions, convention gaps and lint warnings, plus the context it was built from.
 */
export const downloadProposalJson = (proposal: DataModelProposal, softwareSystemName: string): void => {
  const payload = {
    software_system: softwareSystemName,
    version: proposal.version,
    status: proposal.status,
    approved_at: proposal.approved_at,
    created_at: proposal.created_at,
    model: proposal.model,
    conventions_hash: proposal.conventions_hash,
    context_text: proposal.context_text,
    feedback: proposal.feedback,
    summary: proposal.proposal?.summary ?? '',
    tables: proposal.proposal?.tables ?? [],
    excluded: proposal.proposal?.excluded ?? [],
    open_questions: proposal.proposal?.open_questions ?? [],
    convention_gaps: proposal.proposal?.convention_gaps ?? [],
    warnings: proposal.warnings,
  };

  const slug =
    softwareSystemName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'software-system';

  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slug}-data-model-v${proposal.version}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
