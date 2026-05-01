import { IFavoriteRepository } from "../../domain/repositories/IFavoriteRepository";
import { Product } from "../../domain/entities/Product";
import { apiFetch } from "../api/apiClient";

export class FavoriteRepositoryImpl implements IFavoriteRepository {
  async getFavorites(): Promise<Product[]> {
    return apiFetch<Product[]>("/favorites");
  }

  async addToFavorites(productId: string): Promise<void> {
    return apiFetch<void>(`/favorites/${productId}`, {
      method: "POST",
    });
  }

  async removeFromFavorites(productId: string): Promise<void> {
    return apiFetch<void>(`/favorites/${productId}`, {
      method: "DELETE",
    });
  }
}
