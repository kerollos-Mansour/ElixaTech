import { Product } from "../entities/Product";

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  createProduct(formData: FormData): Promise<Product>;
  updateProduct(id: string, formData: FormData): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string): Promise<Product[]>;
  filterProducts(type: string): Promise<Product[]>;
}
