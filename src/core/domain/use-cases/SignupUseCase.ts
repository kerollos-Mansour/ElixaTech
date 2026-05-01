import { IAuthRepository } from "../repositories/IAuthRepository";

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userData: any) {
    return this.authRepository.register(userData);
  }
}
