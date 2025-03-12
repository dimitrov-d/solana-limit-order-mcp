import { Connection, VersionedTransaction, Keypair } from "@solana/web3.js";
import { CancelOrderRequest, CancelOrderResponse } from "../types/types";

export async function cancelOrders(
  connection: Connection,
  wallet: Keypair,
  orderPubkeys?: string[]
): Promise<string[]> {
  try {
    const cancelRequest: CancelOrderRequest = {
      maker: wallet.publicKey.toString(),
      computeUnitPrice: "auto",
      ...(orderPubkeys && { orders: orderPubkeys }),
    };

    const response = await fetch("https://api.jup.ag/limit/v2/cancelOrders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cancelRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CancelOrderResponse = await response.json();
    const signatures: string[] = [];

    // Process each transaction in the response
    for (const txBase64 of data.txs) {
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(txBase64, "base64")
      );

      transaction.sign([wallet]);

      const transactionBinary = transaction.serialize();
      const signature = await connection.sendRawTransaction(transactionBinary, {
        maxRetries: 2,
        skipPreflight: true,
      });

      signatures.push(signature);
    }

    return signatures;
  } catch (error) {
    console.error("Error canceling orders:", error);
    throw error;
  }
}