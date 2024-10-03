export interface orderData {
  phoneNumber: number;
  shippingAddress: string;
  totalAmount: number;
  paymentDetails: {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    pidx?: string;
  };
  items: orderDetails[];
}
export interface orderDetails {
  quantity: number;
  productId: string;
}
export enum PaymentMethod {
  COD = "cod",
  Khalti = "khalti",
}
export enum PaymentStatus {
  Paid = "paid",
  Unpaid = "unpaid",
}
export interface khaltiResponse {
  pidx: string;
  payment_url: string;
  expires_at: Date | string;
  expires_in: number;
  user_fee: number;
}
