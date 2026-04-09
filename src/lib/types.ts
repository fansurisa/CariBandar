// CariBandar - Curated Supplier Directory for Indonesia v1.1
// Core application types

export type PriceLevel = 'budget' | 'affordable' | 'midrange' | 'premium' | 'luxury';
export type SupplierStatus = 'active' | 'draft' | 'inactive';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  owner_name: string;
  email: string;
  description: string;
  category_ids: string[];
  location_city: string;
  location_province: string;
  price_level: PriceLevel;
  contact_whatsapp: string;
  contact_phone: string;
  contact_address: string;
  // Social Media
  social_tiktok?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_wa_business?: string;
  // Online Shops
  shop_shopee?: string;
  shop_tokopedia?: string;
  shop_lazada?: string;
  shop_blibli?: string;
  shop_tiktok?: string;
  // Meta
  rating: number; // 1-5, average from reviews
  review_count: number;
  kurasi_notes: string;
  status: SupplierStatus;
  images: string[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parent_id: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  business_type: 'reseller' | 'umkm' | 'fnb' | 'other';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'expired' | 'cancelled';
  started_at: string;
  expires_at: string;
  payment_id: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'expired';
  payment_method: string;
  qris_url: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  supplier_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  reviewer_name: string; // displayed as first name + last initial
  supplier_id: string;
  rating: number; // 1-5
  review_text?: string; // optional, max 500 chars
  status: ReviewStatus;
  created_at: string;
  moderated_at?: string;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  location: string;
  price_level: PriceLevel | '';
}

// Price level display helpers
export const PRICE_LEVEL_LABELS: Record<PriceLevel, string> = {
  budget: 'Budget',
  affordable: 'Affordable',
  midrange: 'Midrange',
  premium: 'Premium',
  luxury: 'Luxury',
};

export const PRICE_LEVEL_COUNTS: Record<PriceLevel, number> = {
  budget: 1,
  affordable: 2,
  midrange: 3,
  premium: 4,
  luxury: 5,
};

export const PRICE_LEVEL_ORDER: PriceLevel[] = ['budget', 'affordable', 'midrange', 'premium', 'luxury'];
