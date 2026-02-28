export interface PropertyFeature {
  id: number;
  name_en: string;
  name_bg: string;
  icon: string;
  order: number;
}

export interface PropertyImage {
  id: number;
  image: string;
  caption_en: string;
  caption_bg: string;
  order: number;
}

export interface PropertyListItem {
  id: number;
  slug: string;
  title_en: string;
  title_bg: string;
  short_description_en: string;
  short_description_bg: string;
  destination_name_en: string;
  destination_name_bg: string;
  destination_slug: string;
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  price_currency: PriceCurrency;
  formatted_price: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  city: string;
  featured_image: string;
  is_featured: boolean;
  order: number;
  created_at: string;
}

export interface PropertyDetail {
  id: number;
  slug: string;
  title_en: string;
  title_bg: string;
  description_en: string;
  description_bg: string;
  short_description_en: string;
  short_description_bg: string;
  destination: {
    id: number;
    slug: string;
    name_en: string;
    name_bg: string;
    short_description_en: string;
    short_description_bg: string;
    thumbnail_image: string;
    is_featured: boolean;
    order: number;
    active_properties_count: number;
  };
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  price_currency: PriceCurrency;
  formatted_price: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  plot_size_sqm: number | null;
  address: string;
  city: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  featured_image: string;
  video_url: string | null;
  virtual_tour_url: string | null;
  features: PropertyFeature[];
  images: PropertyImage[];
  meta_title_en: string;
  meta_description_en: string;
  is_featured: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export type PropertyType = 'villa' | 'penthouse' | 'mansion' | 'apartment' | 'estate' | 'chalet';
export type PropertyStatus = 'available' | 'reserved' | 'sold';
export type PriceCurrency = 'EUR' | 'USD' | 'GBP' | 'CHF';

export interface PropertySearchParams {
  q?: string;
  min_price?: number;
  max_price?: number;
  min_beds?: number;
  max_beds?: number;
  min_area?: number;
  max_area?: number;
  destination__slug?: string;
  property_type?: PropertyType;
  ordering?: string;
}
