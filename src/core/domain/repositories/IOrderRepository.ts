import { Order } from "../entities/Order";

export interface IOrderRepository {
  createOrder(data: { addressId?: string; contactNumber: string; paymentMethod: string }): Promise<Order>;
  payOrder(orderId: string, paymentMethodId: string): Promise<Order>;
  getMyOrders(): Promise<Order[]>;
  trackOrder(id: string): Promise<any>;
  getAllOrdersAdmin(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
}
