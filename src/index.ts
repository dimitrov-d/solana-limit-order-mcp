import { Connection, VersionedTransaction, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import "dotenv/config";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OpenOrderResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  OrderHistoryResponse,
} from "./types";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOL_MINT = "So11111111111111111111111111111111111111112";
const RPC_URL = process.env.RPC_URL!;

async function createAndSendLimitOrder(
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

async function getOpenOrders(wallet: Keypair): Promise<OpenOrderResponse[]> {
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

async function cancelOrders(
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

async function getOrderHistory(
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

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");
  const wallet = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
  );

  try {
    // console.log("Attempting to create and send limit order...");
    // const { signature, order } = await createAndSendLimitOrder(
    //   connection,
    //   wallet
    // );
    // console.log("Order created and sent successfully:");
    // console.log("- Order ID:", order);
    // console.log("- Transaction:", signature);
    // console.log("- Solscan URL:", `https://solscan.io/tx/${signature}/`);

    // Example usage of new functions
    console.log("\nFetching open orders...");
    const openOrders = await getOpenOrders(wallet);
    console.log("Open Orders:", openOrders);

    if (openOrders.length > 0) {
      console.log("\nCanceling first open order...");
      const orderToCancel = [openOrders[0].publicKey];
      const cancelSignatures = await cancelOrders(
        connection,
        wallet,
        orderToCancel
      );
      console.log("Cancel transaction signatures:", cancelSignatures);
    }

    console.log("\nFetching order history...");
    const orderHistory = await getOrderHistory(wallet);
    console.log("Order History:", orderHistory);
  } catch (error) {
    console.error("Error in main:", error);
  }
}

main();
