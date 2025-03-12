import { Keypair } from "@solana/web3.js";
import { OpenOrderResponse } from "../types/types";

export async function getOpenOrders(wallet: Keypair): Promise<OpenOrderResponse[]> {
  try {
    const response = await fetch(
      `https://api.jup.ag/limit/v2/openOrders?wallet=${wallet.publicKey.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching open orders:", error);
    throw error;
  }
}