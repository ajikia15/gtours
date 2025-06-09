/**
 * Bank of Georgia Payment API Types
 * Based on official API documentation: https://api.bog.ge/docs/en/payments/
 */

// Authentication Types
export interface BOGAuthRequest {
  grant_type: "client_credentials";
}

export interface BOGAuthResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}

// Order Creation Types
export interface BOGOrderRequest {
  application_type?: "web" | "mobile";
  buyer?: {
    full_name?: string;
    masked_email?: string;
    masked_phone?: string;
  };
  callback_url: string;
  external_order_id?: string;
  capture?: "automatic" | "manual";
  purchase_units: {
    basket: BOGBasketItem[];
    delivery?: {
      amount?: number;
    };
    total_amount: number;
    total_discount_amount?: number;
    currency?: "GEL" | "USD" | "EUR" | "GBP";
  };
  redirect_urls?: {
    success?: string;
    fail?: string;
  };
  ttl?: number; // Time to live in minutes (2-1440, default 15)
  payment_method?: Array<
    | "card"
    | "google_pay"
    | "apple_pay"
    | "bog_p2p"
    | "bog_loyalty"
    | "bnpl"
    | "bog_loan"
    | "gift_card"
  >;
  config?: {
    loan?: {
      type?: string;
      month?: number;
    };
    campaign?: {
      card?: "visa" | "mc" | "solo";
      type?: "restrict" | "client_discount";
    };
    google_pay?: {
      google_pay_token?: string;
      external?: boolean;
    };
    apple_pay?: {
      external?: boolean;
    };
    account?: {
      tag?: string;
    };
  };
}

export interface BOGBasketItem {
  product_id: string;
  description?: string;
  quantity: number;
  unit_price: number;
  unit_discount_price?: number;
  vat?: number;
  vat_percent?: number;
  total_price?: number;
  image?: string;
  package_code?: string;
  tin?: string;
  pinfl?: string;
  product_discount_id?: string;
}

export interface BOGOrderResponse {
  id: string;
  _links: {
    details: {
      href: string;
    };
    redirect: {
      href: string;
    };
  };
}

// Callback/Webhook Types
export interface BOGCallback {
  order_id: string;
  status: "success" | "failed" | "pending";
  transaction_id?: string;
  payment_method?: string;
  amount?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for additional fields that might be sent
}

// Error Types
export interface BOGError {
  error: string;
  error_description?: string;
  error_code?: string;
  details?: any;
}

// API Response Types
export type BOGApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: BOGError;
      status?: number;
    };

// Payment Status Types
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface PaymentOrder {
  id: string;
  bogOrderId: string;
  userId: string;
  invoiceId?: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  redirectUrl: string;
  callbackReceived: boolean;
  createdAt: Date;
  updatedAt: Date;
  bogCallback?: BOGCallback;
}
