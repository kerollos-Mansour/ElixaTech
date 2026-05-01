import { AuthResponse, User } from "../entities/User";

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  register(userData: Omit<User, "id"> & { password: "" }): Promise<User>;
}
