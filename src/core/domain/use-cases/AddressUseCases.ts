import { IAddressRepository } from "../repositories/IAddressRepository";

export class AddressUseCases {
  constructor(private addressRepository: IAddressRepository) {}

  async getMyAddresses() {
    return this.addressRepository.getMyAddresses();
  }

  async createAddress(data: { addressDetails: string; phoneNumber: string; isDefault: boolean }) {
    return this.addressRepository.createAddress(data);
  }
}
