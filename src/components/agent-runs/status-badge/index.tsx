import type { AgentRunStatus } from '@/model/agent-run';
import { STATUS_BADGE, STATUS_LABEL } from '../agent-run-labels';

type StatusBadgeProps = { status: AgentRunStatus };

export const StatusBadge = ({ status }: StatusBadgeProps) => <span className={STATUS_BADGE[status]}>{STATUS_LABEL[status]}</span>;
