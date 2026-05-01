import { AuthResponse, User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { apiFetch } from "../api/apiClient";

export class AuthRepositoryImpl implements IAuthRepository {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<User> {
    return apiFetch<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }
}
