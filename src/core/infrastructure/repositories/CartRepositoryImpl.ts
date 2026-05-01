import { Cart } from "../../domain/entities/Cart";
import { ICartRepository } from "../../domain/repositories/ICartRepository";
import { apiFetch } from "../api/apiClient";

export class CartRepositoryImpl implements ICartRepository {
  async getCart(): Promise<Cart> {
    return apiFetch<Cart>("/cart");
  }

  async addToCart(productId: string, quantity: number): Promise<Cart> {
    return apiFetch<Cart>("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    return apiFetch<Cart>(`/cart/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string): Promise<void> {
    return apiFetch<void>(`/cart/${itemId}`, {
      method: "DELETE",
    });
  }
}
