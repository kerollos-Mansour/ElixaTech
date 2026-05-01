import { AuthRepositoryImpl } from "./infrastructure/repositories/AuthRepositoryImpl";
import { ProductRepositoryImpl } from "./infrastructure/repositories/ProductRepositoryImpl";
import { CategoryRepositoryImpl } from "./infrastructure/repositories/CategoryRepositoryImpl";
import { LoginUseCase } from "./domain/use-cases/LoginUseCase";
import { SignupUseCase } from "./domain/use-cases/SignupUseCase";
import { GetProductsUseCase, GetProductDetailUseCase, SearchProductsUseCase, FilterProductsUseCase, GetReviewsUseCase, AddReviewUseCase } from "./domain/use-cases/ProductUseCases";
import { AdminUseCases } from "./domain/use-cases/AdminUseCases";

import { CartRepositoryImpl } from "./infrastructure/repositories/CartRepositoryImpl";
import { CartUseCases } from "./domain/use-cases/CartUseCases";

import { FavoriteRepositoryImpl } from "./infrastructure/repositories/FavoriteRepositoryImpl";
import { FavoriteUseCases } from "./domain/use-cases/FavoriteUseCases";

import { OrderRepositoryImpl } from "./infrastructure/repositories/OrderRepositoryImpl";
import { OrderUseCases } from "./domain/use-cases/OrderUseCases";

import { AddressRepositoryImpl } from "./infrastructure/repositories/AddressRepositoryImpl";
import { AddressUseCases } from "./domain/use-cases/AddressUseCases";
import { GetMeUseCase } from "./domain/use-cases/GetMeUseCase";

const authRepository = new AuthRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const categoryRepository = new CategoryRepositoryImpl();
const cartRepository = new CartRepositoryImpl();
const favoriteRepository = new FavoriteRepositoryImpl();
const orderRepository = new OrderRepositoryImpl();
const addressRepository = new AddressRepositoryImpl();

export const loginUseCase = new LoginUseCase(authRepository);
export const signupUseCase = new SignupUseCase(authRepository);
export const getMeUseCase = new GetMeUseCase(authRepository);

export const getProductsUseCase = new GetProductsUseCase(productRepository);
export const getProductDetailUseCase = new GetProductDetailUseCase(productRepository);
export const searchProductsUseCase = new SearchProductsUseCase(productRepository);
export const filterProductsUseCase = new FilterProductsUseCase(productRepository);
export const getReviewsUseCase = new GetReviewsUseCase(productRepository);
export const addReviewUseCase = new AddReviewUseCase(productRepository);

export const cartUseCases = new CartUseCases(cartRepository);
export const favoriteUseCases = new FavoriteUseCases(favoriteRepository);
export const orderUseCases = new OrderUseCases(orderRepository);
export const addressUseCases = new AddressUseCases(addressRepository);

export const adminUseCases = new AdminUseCases(productRepository, categoryRepository);
