import { Product } from "../entities/Product";

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  createProduct(formData: FormData): Promise<Product>;
}
