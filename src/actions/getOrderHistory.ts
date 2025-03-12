import { Action, SolanaAgentKit } from 'solana-agent-kit';
import { z } from 'zod';
import { getOrderHistoryApi } from '../common/jupiterApi';

export const getOrderHistory: Action = {
  name: 'getOrderHistory',
  similes: [
    'fetch order history',
    'get limit order history',
    'retrieve order history',
  ],
  description: 'Fetches the limit order history for a given wallet.',
  examples: [
    [
      {
        input: {
          walletPublicKey: 'CmwPTro4ogHPhuG9Dozx1X7KiATNudF1rkem3BQmuPn7',
          page: 1,
        },
        output: {
          history: {
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
            hasMoreData: false,
            page: 1,
          },
          success: true,
        },
        explanation: 'Successfully fetched order history for the given wallet.',
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit) => {
    try {
      const history = await getOrderHistoryApi(
        agent.wallet.publicKey.toString(),
      );
      return { history, success: true };
    } catch (error) {
      const errorMessage = `Error fetching order history: ${error}`;
      console.error(errorMessage);
      return { history: null, success: false, error: errorMessage };
    }
  },
};
