import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { apiFetch } from "../api/apiClient";

export class ProductRepositoryImpl implements IProductRepository {
  async getAllProducts(): Promise<Product[]> {
    return apiFetch<Product[]>("/products");
  }

  async getProductById(id: string): Promise<Product> {
    return apiFetch<Product>(`/products/${id}`);
  }

  async createProduct(formData: FormData): Promise<Product> {
    // When sending FormData, fetch automatically sets the correct Content-Type with boundary
    // We need to tell apiFetch not to set Content-Type: application/json
    return apiFetch<Product>("/products", {
      method: "POST",
      body: formData,
      headers: {
        // Letting the browser set the Content-Type for FormData
        "Content-Type": "undefined", 
      },
    });
  }

  async updateProduct(id: string, formData: FormData): Promise<Product> {
    return apiFetch<Product>(`/products/${id}`, {
      method: "PUT", // Postman said PUT
      body: formData,
      headers: {
        "Content-Type": "undefined",
      },
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return apiFetch<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return apiFetch<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async filterProducts(type: string): Promise<Product[]> {
    return apiFetch<Product[]>(`/products/filter?type=${type}`);
  }
}
