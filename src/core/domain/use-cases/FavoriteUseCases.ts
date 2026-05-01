import { IFavoriteRepository } from "../repositories/IFavoriteRepository";

export class FavoriteUseCases {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async getFavorites() {
    return this.favoriteRepository.getFavorites();
  }

  async addToFavorites(productId: string) {
    return this.favoriteRepository.addToFavorites(productId);
  }

  async removeFromFavorites(productId: string) {
    return this.favoriteRepository.removeFromFavorites(productId);
  }
}
