#!/usr/bin/env node
import 'dotenv/config';
import { ACTIONS, SolanaAgentKit, startMcpServer } from 'solana-agent-kit';
import { createLimitOrder } from './actions/createLimitOrder';
import fetchPrice from './actions/fetchPrice';
import { getOpenOrders } from './actions/getOpenOrders';
import { getOrderHistory } from './actions/getOrderHistory';
import { cancelOrders } from './actions/cancelOrders';

async function main() {
  validateEnvironment();

  const agent = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.SOLANA_RPC_URL!,
    {},
  );

  const mcp_actions = {
    // Limit Order Actions
    CREATE_LIMIT_ORDER: createLimitOrder,
    GET_OPEN_ORDERS: getOpenOrders,
    GET_ORDER_HISTORY: getOrderHistory,
    CANCEL_ORDERS: cancelOrders,

    // Solana Agent Kit Actions
    GET_PRICE: fetchPrice,
    GET_WALLET_ADDRESS: ACTIONS.WALLET_ADDRESS_ACTION,
    GET_TOKEN_BALANCE: ACTIONS.TOKEN_BALANCES_ACTION,
    TRADE_TOKENS: ACTIONS.TRADE_ACTION,
    GET_TPS: ACTIONS.GET_TPS_ACTION,
  };

  try {
    // Start the MCP server with error handling
    await startMcpServer(mcp_actions, agent, {
      name: 'solana-agent',
      version: '0.0.1',
    });
  } catch (error) {
    console.error(
      'Failed to start MCP server:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

function validateEnvironment() {
  const requiredEnvVars = {
    SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY,
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();
