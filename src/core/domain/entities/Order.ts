export interface Order {
  id: string;
  userId: string;
  addressId: string;
  contactNumber: string;
  paymentMethod: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items?: any[];
}
