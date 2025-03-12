import axios from "axios";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  OpenOrderResponse,
  OrderHistoryResponse
} from "../types/types";

const jupiterApi = axios.create({
  baseURL: "https://api.jup.ag/limit/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function createOrderApi(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  try {
    const response = await jupiterApi.post<CreateOrderResponse>("/createOrder", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Jupiter API error: ${error.response?.data || error.message}`
      );
    }
    throw error;
  }
}

export async function getOpenOrdersApi(walletAddress: string): Promise<OpenOrderResponse[]> {
  try {
    const response = await jupiterApi.get<OpenOrderResponse[]>(`/openOrders`, {
      params: { wallet: walletAddress }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Jupiter API error: ${error.response?.data || error.message}`
      );
    }
    throw error;
  }
}

export async function cancelOrdersApi(
  data: CancelOrderRequest
): Promise<CancelOrderResponse> {
  try {
    const response = await jupiterApi.post<CancelOrderResponse>("/cancelOrders", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Jupiter API error: ${error.response?.data || error.message}`
      );
    }
    throw error;
  }
}

export async function getOrderHistoryApi(
  walletAddress: string,
  page: number = 1
): Promise<OrderHistoryResponse> {
  try {
    const response = await jupiterApi.get<OrderHistoryResponse>(`/orderHistory`, {
      params: {
        wallet: walletAddress,
        page
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Jupiter API error: ${error.response?.data || error.message}`
      );
    }
    throw error;
  }
}
