import { IAuthRepository } from "../repositories/IAuthRepository";

export class VerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, otp: string) {
    const response = await this.authRepository.verifyOtp(email, otp);
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.token);
    }
    return response;
  }

  async resend(email: string) {
    return await this.authRepository.resendOtp(email);
  }
}
