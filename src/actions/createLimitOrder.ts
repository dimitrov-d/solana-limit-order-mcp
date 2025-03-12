import { Action, Handler, SolanaAgentKit } from 'solana-agent-kit';
import { z } from 'zod';
import { createOrderApi } from '../common/jupiterApi';
import {
  deserializeTransaction,
  signAndSendTransaction,
} from '../common/transactions';
import { CreateOrderRequest } from '../types/types';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export const createLimitOrderSchema = z.object({
  inputMint: z.string(),
  outputMint: z.string(),
  params: z.object({
    makingAmount: z.string(),
    takingAmount: z.string(),
    expiredAt: z.string().optional(),
  }),
});

const createLimitOrderHandler: Handler = async (
  agent: SolanaAgentKit,
  input: Record<string, any>,
) => {
  const { inputMint, outputMint, params } = createLimitOrderSchema.parse(input);
  const wallet = agent.wallet.publicKey.toString();

  const orderRequest: CreateOrderRequest = {
    maker: wallet,
    payer: wallet,
    inputMint,
    outputMint,
    params: {
      makingAmount: params.makingAmount,
      takingAmount: params.takingAmount,
      expiredAt: params.expiredAt,
    },
  };

  try {
    const data = await createOrderApi(orderRequest);
    const transaction = deserializeTransaction(data.tx);
    const signature = await signAndSendTransaction(
      agent.connection,
      transaction,
      agent.wallet,
    );

    return {
      signature,
      order: data.order,
      success: true,
      explanation: 'Order created and sent successfully.',
    };
  } catch (error) {
    const errorMessage = `Error creating and sending limit order: ${error}`;
    console.error(errorMessage);
    return {
      signature: '',
      order: '',
      success: false,
      error: errorMessage,
      explanation: 'Failed to create and send the order.',
    };
  }
};

export const createLimitOrder: Action = {
  name: 'createLimitOrder',
  similes: ['place limit order', 'submit limit order', 'create trading order'],
  description: 'Creates and sends a limit order on the Solana blockchain.',
  examples: [
    [
      {
        input: {
          inputAmount: '5500000',
          outputAmount: '50000000',
        },
        output: {
          signature: '5K3N9...3J4',
          order: 'order123',
          success: true,
          explanation: 'Order created and sent successfully.',
        },
        explanation:
          'Successfully created a limit order with specified amounts.',
      },
      {
        input: {
          inputAmount: '1000000',
          outputAmount: '20000000',
        },
        output: {
          signature: '',
          order: '',
          success: false,
          error: 'Error creating and sending limit order: Network error',
          explanation: 'Failed to create and send the order.',
        },
        explanation: 'Failed to create a limit order due to a network error.',
      },
    ],
  ],
  schema: createLimitOrderSchema,
  handler: createLimitOrderHandler,
};
