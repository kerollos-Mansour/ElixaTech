import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { IProductRepository } from "../repositories/IProductRepository";
import { apiFetch } from "../../infrastructure/api/apiClient";

export class AdminUseCases {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async createCategory(name: string, imageUrl: string) {
    return this.categoryRepository.createCategory(name, imageUrl);
  }

  async createCategoryWithFile(name: string, file: File) {
    // 1. Upload the file first
    const formData = new FormData();
    formData.append("file", file);

    const { url } = await apiFetch<{ url: string }>("/upload?folder=categories", {
      method: "POST",
      body: formData,
    });

    // 2. Create the category with the returned URL
    return this.categoryRepository.createCategory(name, url);
  }

  async updateCategoryWithFile(id: string, name: string, file: File) {
    // 1. Upload the file first
    const formData = new FormData();
    formData.append("file", file);

    const { url } = await apiFetch<{ url: string }>("/upload?folder=categories", {
      method: "POST",
      body: formData,
    });

    // 2. Update the category with the returned URL
    return this.categoryRepository.updateCategory(id, name, url);
  }

  async createProduct(formData: FormData) {
    return this.productRepository.createProduct(formData);
  }

  async updateProduct(id: string, formData: FormData) {
    return this.productRepository.updateProduct(id, formData);
  }

  async deleteProduct(id: string) {
    return this.productRepository.deleteProduct(id);
  }

  async updateCategory(id: string, name: string, imageUrl: string) {
    return this.categoryRepository.updateCategory(id, name, imageUrl);
  }

  async deleteCategory(id: string) {
    return this.categoryRepository.deleteCategory(id);
  }

  async getCategories() {
    return this.categoryRepository.getAllCategories();
  }
}
