import { Connection, Keypair } from "@solana/web3.js";
import { cancelOrdersApi } from "../common/jupiterApi";
import {
  deserializeTransaction,
  signAndSendTransactions,
} from "../common/transactions";
import { CancelOrderRequest } from "../types/types";

export async function cancelOrders(
  connection: Connection,
  wallet: Keypair,
  orderPubkeys?: string[],
): Promise<{
  signatures: string[];
  success: boolean;
  error?: string;
}> {
  try {
    const cancelRequest: CancelOrderRequest = {
      maker: wallet.publicKey.toString(),
      computeUnitPrice: "auto",
      ...(orderPubkeys && { orders: orderPubkeys }),
    };

    const data = await cancelOrdersApi(cancelRequest);
    const transactions = data.txs.map((tx: string) =>
      deserializeTransaction(tx),
    );

    const signatures = await signAndSendTransactions(
      connection,
      transactions,
      wallet,
    );

    return { signatures, success: true };
  } catch (error) {
    const errorMessage = `Error canceling orders: ${error}`;
    console.error(errorMessage);
    return { signatures: [], success: false, error: errorMessage };
  }
}
