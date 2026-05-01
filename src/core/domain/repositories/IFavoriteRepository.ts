import { Product } from "../entities/Product";

export interface IFavoriteRepository {
  getFavorites(): Promise<Product[]>;
  addToFavorites(productId: string): Promise<void>;
  removeFromFavorites(productId: string): Promise<void>;
}
