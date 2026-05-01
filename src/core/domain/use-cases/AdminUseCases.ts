import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { IProductRepository } from "../repositories/IProductRepository";

export class AdminUseCases {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async createCategory(name: string, imageUrl: string) {
    return this.categoryRepository.createCategory(name, imageUrl);
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
