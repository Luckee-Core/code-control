import type { TiptapContent } from './content';

export type CampaignEmailVariation = {
  id: string;
  campaign_id: string;
  subject: string;
  body: TiptapContent;
  created_at: string;
  updated_at: string;
};
