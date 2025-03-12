import { z } from 'zod';
import { getOpenOrdersApi } from '../common/jupiterApi';
import { Action, SolanaAgentKit } from 'solana-agent-kit';

export const getOpenOrders: Action = {
  name: 'getOpenOrders',
  similes: ['fetch open orders', 'get limit orders', 'retrieve open orders'],
  description: 'Fetches the open limit orders for a given wallet.',
  examples: [
    [
      {
        input: {
          walletPublicKey: 'CmwPTro4ogHPhuG9Dozx1X7KiATNudF1rkem3BQmuPn7',
        },
        output: {
          orders: [
            {
              userPubkey: 'CmwPTro4ogHPhuG9Dozx1X7KiATNudF1rkem3BQmuPn7',
              orderKey: 'GgMvwcfMzP9AmfwZuMzNienXGBhQa8dksihZvTmyBZYM',
              inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
              outputMint: 'So11111111111111111111111111111111111111112',
              makingAmount: '10000000',
              takingAmount: '50000000',
              remainingMakingAmount: '50000000',
              remainingTakingAmount: '10000000',
              expiredAt: null,
              createdAt: '2023-10-01T00:00:00Z',
              updatedAt: '2023-10-02T00:00:00Z',
              status: 'Open',
              openTx:
                'https://solscan.io/tx/2431GhdNNd3bZ1pH1anFFwWgPuBrt3k9h6Wgezcjn9mpYAbwRfTeyHNmb77BBCSk34SW2iFH8AXzrPwu17zQARjr',
              closeTx: '',
              programVersion: '1.0',
              trades: [
                {
                  amount: '10000000',
                  price: '50000000',
                  timestamp: '2023-10-01T01:00:00Z',
                },
              ],
            },
          ],
          success: true,
        },
        explanation: 'Successfully fetched open orders for the given wallet.',
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit) => {
    try {
      const orders = await getOpenOrdersApi(agent.wallet.publicKey.toString());
      return { orders, success: true };
    } catch (error) {
      const errorMessage = `Error fetching open orders: ${error}`;
      console.error(errorMessage);
      return { orders: [], success: false, error: errorMessage };
    }
  },
};
