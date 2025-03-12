import { Connection, VersionedTransaction, Keypair } from "@solana/web3.js";
import { CreateOrderRequest, CreateOrderResponse } from "../types/types";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOL_MINT = "So11111111111111111111111111111111111111112";

export async function createAndSendLimitOrder(
  connection: Connection,
  wallet: Keypair
): Promise<{ signature: string; order: string }> {
  const inputAmount = "5000000";
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
    const response = await fetch("https://api.jup.ag/limit/v2/createOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${
          response.status
        }, response: ${await response.text()}`
      );
    }

    const data: CreateOrderResponse = await response.json();

    const transaction = VersionedTransaction.deserialize(
      Buffer.from(data.tx, "base64")
    );

    transaction.sign([wallet]);

    console.log("Sending transaction...");
    const transactionBinary = transaction.serialize();
    const signature = await connection.sendRawTransaction(transactionBinary, {
      maxRetries: 2,
      skipPreflight: true,
    });

    return { signature, order: data.order };
  } catch (error) {
    console.error("Error creating and sending limit order:", error);
    throw error;
  }
}