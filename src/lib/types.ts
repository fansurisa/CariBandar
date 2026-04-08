// CariBandar - Curated Supplier Directory for Indonesia
// Core application types

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_ids: string[];
  location_city: string;
  location_province: string;
  contact_whatsapp: string;
  contact_phone: string;
  contact_address: string;
  min_order: string;
  payment_methods: string[];
  rating: number; // 1-5
  kurasi_notes: string;
  status: 'active' | 'draft' | 'inactive';
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

export interface SearchFilters {
  query: string;
  categories: string[];
  location: string;
}
