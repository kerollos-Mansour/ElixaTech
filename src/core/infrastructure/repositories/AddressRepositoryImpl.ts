import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { Address } from "../../domain/entities/Address";
import { apiFetch } from "../api/apiClient";

export class AddressRepositoryImpl implements IAddressRepository {
  async getMyAddresses(): Promise<Address[]> {
    return apiFetch<Address[]>("/address");
  }

  async createAddress(data: { addressDetails: string; phoneNumber: string; isDefault: boolean }): Promise<Address> {
    return apiFetch<Address>("/address", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
