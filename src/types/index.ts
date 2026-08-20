export interface Category {
  slug: string;
  name: string;
  description?: string;
  image?: string;
}

export type FormatType = "printed" | "pdf" | "video";

export interface DigitalAssets {
  pdf?: string | null;
  video?: string | null;
  videoThumbnail?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  code: string;
  description: string;
  image: string;
  gallery: string[];
  formats: FormatType[];
  digitalAssets?: DigitalAssets;
  featured: boolean;
  newArrival: boolean;
  tags?: string[];
}

