import { IAuthRepository } from "../repositories/IAuthRepository";

export class GetMeUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute() {
    return this.authRepository.getMe();
  }
}
