import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import "dotenv/config";
import { getOpenOrders } from "./actions/getOpenOrders";
import { cancelOrders } from "./actions/cancelOrders";
import { getOrderHistory } from "./actions/getOrderHistory";
import { createLimitOrder } from "./actions/createLimitOrder";

async function main() {
  const connection = new Connection(process.env.SOLANA_RPC_URL!, "confirmed");
  const wallet = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
  );

  try {
    console.log("Attempting to create and send limit order...");
    const { signature, order, success, error } = await createLimitOrder(
      connection,
      wallet
    );
    if (success) {
      console.log("Order created and sent successfully:");
      console.log("- Order ID:", order);
      console.log("- Transaction:", signature);
      console.log("- Solscan URL:", `https://solscan.io/tx/${signature}/`);
    } else {
      console.error("Order creation failed:", error);
    }

    console.log("\nFetching open orders...");
    const { orders } = await getOpenOrders(wallet);
    console.log("Open Orders:", orders);

    if (orders.length > 0) {
      console.log("\nCanceling first open order...");
      const orderToCancel = [orders[0].publicKey];
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
