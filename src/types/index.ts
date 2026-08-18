export interface Category {
  slug: string;
  name: string;
  description?: string;
  image?: string;
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
  featured: boolean;
  newArrival: boolean;
}
