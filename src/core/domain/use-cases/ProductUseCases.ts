import { IProductRepository } from "../repositories/IProductRepository";

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute() {
    return this.productRepository.getAllProducts();
  }
}

export class GetProductDetailUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string) {
    return this.productRepository.getProductById(id);
  }
}
