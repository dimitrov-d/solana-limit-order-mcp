import { Connection, Keypair } from "@solana/web3.js";
import { CreateOrderRequest } from "../types/types";
import { createOrderApi } from "../common/jupiterApi";
import {
  deserializeTransaction,
  signAndSendTransaction,
} from "../common/transactions";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOL_MINT = "So11111111111111111111111111111111111111112";

export async function createLimitOrder(
  connection: Connection,
  wallet: Keypair
): Promise<{
  signature: string;
  order: string;
  success: boolean;
  error?: string;
}> {
  const inputAmount = "5500000";
  const outputAmount = "50000000";

  const orderRequest: CreateOrderRequest = {
    inputMint: USDC_MINT,
    outputMint: SOL_MINT,
    maker: wallet.publicKey.toString(),
    payer: wallet.publicKey.toString(),
    params: {
      makingAmount: inputAmount,
      takingAmount: outputAmount,
      expiredAt: (Math.floor(Date.now() / 1000) + 24 * 60 * 60).toString(),
    },
  };

  try {
    const data = await createOrderApi(orderRequest);
    const transaction = deserializeTransaction(data.tx);
    const signature = await signAndSendTransaction(
      connection,
      transaction,
      wallet
    );

    return { signature, order: data.order, success: true };
  } catch (error) {
    const errorMessage = `Error creating and sending limit order: ${error}`;
    console.error(errorMessage);
    return { signature: "", order: "", success: false, error: errorMessage };
  }
}
