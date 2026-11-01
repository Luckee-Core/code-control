export type CustomerStatus = 'pending_review' | 'active' | 'inactive';

export type Customer = {
  id: string;
  user_id: string | null;
  name: string;
  status: CustomerStatus;
  company: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  facebook_url: string | null;
  created_at: string;
  updated_at: string;
};
