import { IOrderRepository } from "../repositories/IOrderRepository";

export class OrderUseCases {
  constructor(private orderRepository: IOrderRepository) {}

  async createOrder(data: { addressId?: string; contactNumber: string; paymentMethod: string }) {
    return this.orderRepository.createOrder(data);
  }

  async getMyOrders() {
    return this.orderRepository.getMyOrders();
  }

  async trackOrder(id: string) {
    return this.orderRepository.trackOrder(id);
  }

  async getAllOrdersAdmin() {
    return this.orderRepository.getAllOrdersAdmin();
  }

  async updateOrderStatus(id: string, status: string) {
    return this.orderRepository.updateOrderStatus(id, status);
  }
}
