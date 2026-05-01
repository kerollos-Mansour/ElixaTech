export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  categoryId: string; // From Doc and your example
  name: string;
  description: string;
  price: number | string; // Handle both types safely
  stockQuantity: number;
  rating?: number | null; // From your example
  isRecommended: boolean;
  images?: ProductImage[]; // Array of images as per Doc and example
  // Fallbacks for compatibility
  imageUrl?: string;
  image?: string;
}
