export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
