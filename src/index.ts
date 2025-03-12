import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import "dotenv/config";
import { getOpenOrders } from "./actions/getOpenOrders";
import { cancelOrders } from "./actions/cancelOrder";
import { getOrderHistory } from "./actions/getOrderHistory";
import { createAndSendLimitOrder } from "./actions/createLimitOrder";

const RPC_URL = process.env.RPC_URL!;

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");
  const wallet = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
  );

  try {
    console.log("Attempting to create and send limit order...");
    const { signature, order } = await createAndSendLimitOrder(
      connection,
      wallet
    );
    console.log("Order created and sent successfully:");
    console.log("- Order ID:", order);
    console.log("- Transaction:", signature);
    console.log("- Solscan URL:", `https://solscan.io/tx/${signature}/`);

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
