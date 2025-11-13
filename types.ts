export interface Article {
  id: number;
  title: string;
  publicationDate: string; // ISO Date string
  isFeatured?: boolean;
  // Optional properties for published articles
  imageUrl?: string;
  alt?: string;
  author?: string;
  subcategory?: string;
  description?: string;
  link?: string;
  body?: string;
}

export interface Subcategory {
  name: string;
  articles: Article[];
}

export interface Category {
  name: string;
  subcategories: Subcategory[];
  imageUrl?: string;
  alt?: string;
}