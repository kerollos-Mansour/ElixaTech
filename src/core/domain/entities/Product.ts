export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  image?: string;
  isRecommended: boolean;
  averageRating?: number;
}
