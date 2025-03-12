import { Action, SolanaAgentKit } from 'solana-agent-kit';
import { z } from 'zod';
import { cancelOrdersApi } from '../common/jupiterApi';
import {
  deserializeTransaction,
  signAndSendTransactions,
} from '../common/transactions';
import { CancelOrderRequest } from '../types/types';

export const cancelOrdersSchema = z.object({
  orderPubkeys: z.array(z.string()).optional(),
});

export const cancelOrders: Action = {
  name: 'cancelOrders',
  similes: ['abort orders', 'revoke orders', 'terminate orders'],
  description: 'Cancels specified orders on the Solana blockchain.',
  examples: [
    [
      {
        input: {
          orderPubkeys: [
            'GgMvwcfMzP9AmfwZuMzNienXGBhQa8dksihZvTmyBZYM',
            'HhNvwcfMzP9AmfwZuMzNienXGBhQa8dksihZvTmyBZYN',
          ],
        },
        output: {
          signatures: ['5K3N9...3J4', '6L4O0...4K5'],
          success: true,
          explanation: 'Orders canceled successfully.',
        },
        explanation: 'Successfully canceled the specified orders.',
      },
      {
        input: {
          orderPubkeys: ['InvalidOrderKey'],
        },
        output: {
          signatures: [],
          success: false,
          error: 'Error canceling orders: Invalid order key',
          explanation: 'Failed to cancel orders due to invalid order key.',
        },
        explanation: 'Failed to cancel orders due to an invalid order key.',
      },
    ],
  ],
  schema: cancelOrdersSchema,
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const { orderPubkeys } = cancelOrdersSchema.parse(input);
    const wallet = agent.wallet;

    try {
      const cancelRequest: CancelOrderRequest = {
        maker: wallet.publicKey.toString(),
        ...(orderPubkeys && { orders: orderPubkeys }),
      };

      const data = await cancelOrdersApi(cancelRequest);
      const transactions = data.txs.map((tx: string) =>
        deserializeTransaction(tx),
      );

      const signatures = await signAndSendTransactions(
        agent.connection,
        transactions,
        wallet,
      );

      return {
        signatures,
        success: true,
        solscanLinks: signatures.map(
          (signature) => `https://solscan.io/tx/${signature}`,
        ),
      };
    } catch (error) {
      const errorMessage = `Error canceling orders: ${error}`;
      console.error(errorMessage);
      return { signatures: [], success: false, error: errorMessage };
    }
  },
};
