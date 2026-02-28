export interface PropertyInquiryCreate {
  property: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  budget_range?: string;
  preferred_contact_method?: 'email' | 'phone' | 'whatsapp';
}

export interface PropertyInquiryResponse {
  message: string;
  inquiry_id: number;
}

export interface PropertyInquiry {
  id: number;
  property: number;
  property_title: string;
  property_slug: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  budget_range: string;
  preferred_contact_method: string;
  is_contacted: boolean;
  contacted_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}
