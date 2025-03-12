import { Keypair } from "@solana/web3.js";
import { OrderHistoryResponse } from "../types/types";
import { getOrderHistoryApi } from "../common/jupiterApi";

export async function getOrderHistory(
  wallet: Keypair,
  page: number = 1
): Promise<{
  history: OrderHistoryResponse | null;
  success: boolean;
  error?: string;
}> {
  try {
    const history = await getOrderHistoryApi(wallet.publicKey.toString(), page);
    return { history, success: true };
  } catch (error) {
    const errorMessage = `Error fetching order history: ${error}`;
    console.error(errorMessage);
    return { history: null, success: false, error: errorMessage };
  }
}
