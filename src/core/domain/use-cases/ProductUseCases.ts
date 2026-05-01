import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }
}

export class GetProductDetailUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    return this.productRepository.getProductById(id);
  }
}

export class SearchProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(query: string): Promise<Product[]> {
    return this.productRepository.searchProducts(query);
  }
}

export class FilterProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(type: string): Promise<Product[]> {
    return this.productRepository.filterProducts(type);
  }
}

export class GetReviewsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: string) {
    return this.productRepository.getProductReviews(productId);
  }
}

export class AddReviewUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: string, rating: number, comment: string) {
    return this.productRepository.addProductReview(productId, rating, comment);
  }
}
