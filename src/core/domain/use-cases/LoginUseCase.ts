import { IAuthRepository } from "../repositories/IAuthRepository";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: "") {
    const response = await this.authRepository.login(email, password);
    // Persist token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_role", response.user.role);
    }
    return response;
  }
}
