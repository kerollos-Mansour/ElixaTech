export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface ICategoryRepository {
  getAllCategories(): Promise<Category[]>;
  createCategory(name: string, imageUrl: string): Promise<Category>;
}
