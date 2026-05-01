import { Address } from "../entities/Address";

export interface IAddressRepository {
  getMyAddresses(): Promise<Address[]>;
  createAddress(data: { addressDetails: string; phoneNumber: string; isDefault: boolean }): Promise<Address>;
}
