import { Product } from "./Product";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  priceAtAddition: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}
