import { Connection, VersionedTransaction, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import "dotenv/config";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOL_MINT = "So11111111111111111111111111111111111111112";
const RPC_URL = process.env.RPC_URL!;

interface CreateOrderRequest {
  inputMint: string;
  outputMint: string;
  maker: string;
  payer: string;
  params: {
    makingAmount: string;
    takingAmount: string;
    expiredAt?: string;
    feeBps?: string;
  };
  computeUnitPrice: string | "auto";
  referral?: string;
  wrapAndUnwrapSol?: boolean;
}

interface CreateOrderResponse {
  order: string;
  tx: string;
}

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
    computeUnitPrice: "auto",
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
      throw new Error(`HTTP error! status: ${response.status}`);
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

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");

  const wallet = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));

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
  } catch (error) {
    console.error("Failed to create and send order:", error);
  }
}

main();
