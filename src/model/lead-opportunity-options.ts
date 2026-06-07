/**
 * Legacy opportunity tags that may still appear on historical project/customer data.
 */

export type LeadOpportunityId =
  | 'website_redo'
  | 'admin_automation'
  | 'report_automation'
  | 'software_app';

export const LEAD_OPPORTUNITY_OPTIONS: { id: LeadOpportunityId; label: string }[] = [
  { id: 'website_redo', label: 'Website redo' },
  { id: 'admin_automation', label: 'Admin automation' },
  { id: 'report_automation', label: 'Report automation' },
  { id: 'software_app', label: 'Software app' },
];
