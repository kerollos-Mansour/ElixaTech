import { ICartRepository } from "../repositories/ICartRepository";

export class CartUseCases {
  constructor(private cartRepository: ICartRepository) {}

  async getCart() {
    return this.cartRepository.getCart();
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.cartRepository.addToCart(productId, quantity);
  }

  async updateQuantity(itemId: string, quantity: number) {
    return this.cartRepository.updateQuantity(itemId, quantity);
  }

  async removeFromCart(itemId: string) {
    return this.cartRepository.removeFromCart(itemId);
  }
}
