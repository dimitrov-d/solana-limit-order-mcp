import { Keypair } from "@solana/web3.js";
import { OrderHistoryResponse } from "../types/types";

export async function getOrderHistory(
  wallet: Keypair,
  page: number = 1
): Promise<OrderHistoryResponse> {
  try {
    const response = await fetch(
      `https://api.jup.ag/limit/v2/orderHistory?wallet=${wallet.publicKey.toString()}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error;
  }
}