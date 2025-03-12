import axios, { AxiosResponse } from "axios";
import {
  CancelOrderRequest,
  CancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  OpenOrderResponse,
  OrderHistoryResponse,
} from "../types/types";

const jupiterApi = axios.create({
  baseURL: "https://api.jup.ag/limit/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

async function handleApiRequest<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
): Promise<T> {
  try {
    const { data } = await apiCall();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Jupiter API error: ${
          error.response?.data
            ? JSON.stringify(error.response.data)
            : error.message
        }`,
      );
    }
    throw error;
  }
}

export async function createOrderApi(
  data: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  return handleApiRequest(async () =>
    jupiterApi.post<CreateOrderResponse>("/createOrder", data),
  );
}

export async function getOpenOrdersApi(
  walletAddress: string,
): Promise<OpenOrderResponse[]> {
  return handleApiRequest(async () =>
    jupiterApi.get<OpenOrderResponse[]>("/openOrders", {
      params: { wallet: walletAddress },
    }),
  );
}

export async function cancelOrdersApi(
  data: CancelOrderRequest,
): Promise<CancelOrderResponse> {
  return handleApiRequest(async () =>
    jupiterApi.post<CancelOrderResponse>("/cancelOrders", data),
  );
}

export async function getOrderHistoryApi(
  walletAddress: string,
  page: number = 1,
): Promise<OrderHistoryResponse> {
  return handleApiRequest(async () =>
    jupiterApi.get<OrderHistoryResponse>("/orderHistory", {
      params: {
        wallet: walletAddress,
        page,
      },
    }),
  );
}
