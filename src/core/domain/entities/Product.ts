export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number | string;
  stockQuantity: number;
  rating?: number | null; 
  averageRating?: number | null; // From reviews API
  totalReviews?: number; // From reviews API
  isRecommended: boolean;
  images?: ProductImage[];
  imageUrl?: string;
  image?: string;
}
