import { Keypair } from "@solana/web3.js";
import { OpenOrderResponse } from "../types/types";
import { getOpenOrdersApi } from "../common/jupiterApi";

export async function getOpenOrders(wallet: Keypair): Promise<{
  orders: OpenOrderResponse[];
  success: boolean;
  error?: string;
}> {
  try {
    const orders = await getOpenOrdersApi(wallet.publicKey.toString());
    return { orders, success: true };
  } catch (error) {
    const errorMessage = `Error fetching open orders: ${error}`;
    console.error(errorMessage);
    return { orders: [], success: false, error: errorMessage };
  }
}
