import { AuthResponse, User } from "../entities/User";

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  register(userData: Omit<User, "id"> & { password: "" }): Promise<User>;
  verifyOtp(email: string, otp: string): Promise<AuthResponse>;
  resendOtp(email: string): Promise<any>;
  getMe(): Promise<User>;
}
