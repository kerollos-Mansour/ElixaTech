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

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async resendOtp(email: string): Promise<any> {
    // If backend doesn't have this exact endpoint, it might need to be created.
    return apiFetch<any>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async getMe(): Promise<User> {
    return apiFetch<User>("/auth/me");
  }
}
