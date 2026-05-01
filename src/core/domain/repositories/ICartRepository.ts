import { Cart } from "../entities/Cart";

export interface ICartRepository {
  getCart(): Promise<Cart>;
  addToCart(productId: string, quantity: number): Promise<Cart>;
  updateQuantity(itemId: string, quantity: number): Promise<Cart>;
  removeFromCart(itemId: string): Promise<void>;
  clearCart(): Promise<void>;
}
