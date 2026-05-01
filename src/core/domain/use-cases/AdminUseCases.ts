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

  async getCategories() {
    return this.categoryRepository.getAllCategories();
  }
}
