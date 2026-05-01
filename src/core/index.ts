import { AuthRepositoryImpl } from "./infrastructure/repositories/AuthRepositoryImpl";
import { ProductRepositoryImpl } from "./infrastructure/repositories/ProductRepositoryImpl";
import { CategoryRepositoryImpl } from "./infrastructure/repositories/CategoryRepositoryImpl";
import { LoginUseCase } from "./domain/use-cases/LoginUseCase";
import { SignupUseCase } from "./domain/use-cases/SignupUseCase";
import { GetProductsUseCase, GetProductDetailUseCase } from "./domain/use-cases/ProductUseCases";
import { AdminUseCases } from "./domain/use-cases/AdminUseCases";

const authRepository = new AuthRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const categoryRepository = new CategoryRepositoryImpl();

export const loginUseCase = new LoginUseCase(authRepository);
export const signupUseCase = new SignupUseCase(authRepository);

export const getProductsUseCase = new GetProductsUseCase(productRepository);
export const getProductDetailUseCase = new GetProductDetailUseCase(productRepository);

export const adminUseCases = new AdminUseCases(productRepository, categoryRepository);
