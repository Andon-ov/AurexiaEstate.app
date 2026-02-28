export interface Destination {
  id: number;
  slug: string;
  name_en: string;
  name_bg: string;
  description_en: string;
  description_bg: string;
  short_description_en: string;
  short_description_bg: string;
  hero_image: string;
  thumbnail_image: string;
  meta_title_en: string;
  meta_description_en: string;
  is_featured: boolean;
  is_active: boolean;
  order: number;
  active_properties_count: number;
  created_at: string;
  updated_at: string;
}
