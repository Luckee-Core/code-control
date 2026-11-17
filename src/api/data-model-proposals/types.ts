import type { DataModelProposal } from '@/model/data-model-proposal';
import type { DataModelProposalAiExchangeSummary } from '@/model/data-model-proposal-ai-exchange';

/** GET /api/data/data-model-proposals/:id */
export type DataModelProposalDetail = {
  proposal: DataModelProposal;
  exchanges: DataModelProposalAiExchangeSummary[];
};
