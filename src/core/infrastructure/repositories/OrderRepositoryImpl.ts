import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
import { apiFetch } from "../api/apiClient";

export class OrderRepositoryImpl implements IOrderRepository {
  async createOrder(data: { addressId?: string; contactNumber: string; paymentMethod: string }): Promise<Order> {
    return apiFetch<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async payOrder(orderId: string, paymentMethodId: string): Promise<Order> {
    return apiFetch<Order>(`/orders/${orderId}/pay`, {
      method: "POST",
      body: JSON.stringify({ paymentMethodId }),
    });
  }

  async getMyOrders(): Promise<Order[]> {
    return apiFetch<Order[]>("/orders");
  }

  async trackOrder(id: string): Promise<any> {
    // The UI TrackOrderPage expects the FULL order details (price, address, items)
    // not just the tracking steps. So we must use the endpoint that returns the full order.
    try {
      return await apiFetch<any>(`/orders/${id}`);
    } catch (err: any) {
      // Fallback if /orders/{id} fails for any reason
      const orders = await apiFetch<Order[]>("/orders");
      const order = orders.find(o => o.id === id);
      if (!order) throw new Error("Order not found");
      return order;
    }
  }

  async getAllOrdersAdmin(): Promise<Order[]> {
    return apiFetch<Order[]>("/admin/orders").catch(() => apiFetch<Order[]>("/orders/admin")).catch(() => apiFetch<Order[]>("/orders"));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return apiFetch<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).catch(() => apiFetch<Order>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }));
  }
}
