"use server";

/**
 * Bank of Georgia Payment API Client
 *
 * Two-step process:
 * 1. Get JWT token using OAuth2 with Basic Auth
 * 2. Create payment order using Bearer token
 *
 * Based on official BOG documentation
 */

import type {
  BOGAuthResponse,
  BOGOrderRequest,
  BOGOrderResponse,
  BOGApiResponse,
} from "@/types/BOG";

// API Endpoints
const BOG_AUTH_URL =
  "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_ORDERS_URL = "https://api.bog.ge/payments/v1/ecommerce/orders";

// Environment variables
const BOG_CLIENT_ID = process.env.BOG_API_CLIENT_ID;
const BOG_CLIENT_SECRET = process.env.BOG_API_CLIENT_SECRET;

if (!BOG_CLIENT_ID || !BOG_CLIENT_SECRET) {
  throw new Error(
    "BOG_API_CLIENT_ID and BOG_API_CLIENT_SECRET must be set in environment variables"
  );
}

/**
 * In-memory token cache
 * In production, use Redis or database
 */
let tokenCache: {
  token: string;
  expiresAt: number;
} | null = null;

/**
 * Step 1: Get JWT access token using OAuth2 client credentials
 */
async function getAccessToken(): Promise<BOGApiResponse<string>> {
  try {
    // Check if we have a valid cached token
    if (tokenCache && Date.now() < tokenCache.expiresAt) {
      console.log("Using cached BOG token");
      return { success: true, data: tokenCache.token };
    }

    console.log("Getting new BOG access token...");

    // Create Basic Auth credentials: base64(client_id:client_secret)
    const credentials = Buffer.from(
      `${BOG_CLIENT_ID}:${BOG_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(BOG_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BOG Auth failed:", response.status, errorText);

      return {
        success: false,
        error: {
          error: "authentication_failed",
          error_description: `Authentication failed: ${response.status}`,
          details: errorText,
        },
        status: response.status,
      };
    }

    const authData: BOGAuthResponse = await response.json();
    console.log("BOG auth successful, token type:", authData.token_type);

    // Cache the token with safety margin
    tokenCache = {
      token: authData.access_token,
      expiresAt: Date.now() + (authData.expires_in - 300) * 1000, // 5 min safety margin
    };

    return { success: true, data: authData.access_token };
  } catch (error) {
    console.error("BOG Auth error:", error);
    return {
      success: false,
      error: {
        error: "network_error",
        error_description: "Failed to connect to BOG authentication server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

/**
 * Step 2: Create payment order using Bearer token
 */
export async function createOrder(
  orderData: BOGOrderRequest
): Promise<BOGApiResponse<BOGOrderResponse>> {
  try {
    console.log("Creating BOG order:", orderData.external_order_id);

    // Get access token
    const tokenResult = await getAccessToken();
    if (!tokenResult.success) {
      return tokenResult as BOGApiResponse<BOGOrderResponse>;
    }

    // Create order with Bearer token
    const response = await fetch(BOG_ORDERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResult.data}`,
        "Accept-Language": "ka", // Georgian language
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BOG Order creation failed:", response.status, errorText);

      return {
        success: false,
        error: {
          error: "order_creation_failed",
          error_description: `Failed to create BOG order: ${response.status}`,
          details: errorText,
        },
        status: response.status,
      };
    }

    const orderResponse: BOGOrderResponse = await response.json();
    console.log("BOG order created successfully:", orderResponse.id);

    return { success: true, data: orderResponse };
  } catch (error) {
    console.error("BOG Order creation error:", error);
    return {
      success: false,
      error: {
        error: "network_error",
        error_description: "Failed to connect to BOG orders API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

/**
 * Get order status
 */
export async function getOrderStatus(
  orderId: string
): Promise<BOGApiResponse<any>> {
  try {
    const tokenResult = await getAccessToken();
    if (!tokenResult.success) {
      return tokenResult;
    }

    const response = await fetch(`${BOG_ORDERS_URL}/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenResult.data}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: {
          error: "status_check_failed",
          error_description: `Failed to get order status: ${response.status}`,
          details: errorText,
        },
        status: response.status,
      };
    }

    const statusData = await response.json();
    return { success: true, data: statusData };
  } catch (error) {
    return {
      success: false,
      error: {
        error: "network_error",
        error_description: "Failed to check order status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
