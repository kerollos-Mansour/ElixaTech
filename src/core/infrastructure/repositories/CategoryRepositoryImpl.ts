import { Category, ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { apiFetch } from "../api/apiClient";

export class CategoryRepositoryImpl implements ICategoryRepository {
  async getAllCategories(): Promise<Category[]> {
    return apiFetch<Category[]>("/categories");
  }

  async createCategory(name: string, imageUrl: string): Promise<Category> {
    return apiFetch<Category>("/categories", {
      method: "POST",
      body: JSON.stringify({ name, imageUrl }),
    });
  }
}
