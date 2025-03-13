# Solana Limit Order MCP Server

## Model Context Protocol (MCP)

A Model Context Protocol (MCP) server that provides a comprehensive suite of tools for AI models, enabling them to interact with various systems through a standardized and unified interface. MCP serves as a bridge between AI agents and external systems, allowing for seamless execution of operations, querying of information, and management of resources. 

By adhering to the MCP specification, this server ensures that AI agents can perform complex tasks efficiently and reliably, without needing to understand the intricacies of each individual system they interact with.

## Overview

This MCP server extends AI capabilities by providing tools to:

* Create Limit Orders on Solana via Jupiter
* Get an overview of your open orders
* Get a simplified overview of your past orders
* Cancel open limit orders

## Prerequisites

* Node.js (v20 or higher)
* npm or yarn
* A Solana wallet private key and RPC URL

## Installation

1. Clone this repository:
```bash
git clone https://github.com/dimitrov-d/solana-limit-order-mcp
cd solana-limit-order-mcp
```

2. Install dependencies:
```bash
pnpm install
```

## Configuration

### Environment Setup

Create a `.env` file with your credentials:

```env
SOLANA_PRIVATE_KEY=your_private_key_here
SOLANA_RPC_URL=your_rpc_url_here
```

### Using with Claude

To use this MCP with the Claude LLM, follow these steps:

1. **Install [Claude for Desktop](https://claude.ai/download)**

2. **Locate the Claude Desktop Configuration File**
  - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
  - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
  - Linux: `~/.config/Claude/claude_desktop_config.json`

3. **Add the Configuration**

Copy the configuration from [claude_desktop_config.json](./claude_desktop_config.json) and adjust it with your own parameters:

```json
{
  "mcpServers": {
    "solana-limit-order-mcp": {
      "command": "tsx",
      "args": ["/full/path/to/index.ts"],
      "env": {
        "SOLANA_RPC_URL": "<SOLANA_RPC_URL>",
        "SOLANA_PRIVATE_KEY": "<SOLANA_PRIVATE_KEY>"
      }
    }
  }
}
```

4. **Restart Claude for Desktop**

After making these changes, restart Claude Desktop for the configuration to take effect.
You can now prompt Claude to perform any of the available actions using only the text chat.

## Available Actions

The MCP server provides the following actions:

* `CREATE_LIMIT_ORDER` - Creates and sends a limit order on Solana via Jupiter.
* `GET_OPEN_ORDERS` - Fetches the open limit orders for your wallet.
* `GET_ORDER_HISTORY` - Fetches the limit order history for your wallet.
* `CANCEL_ORDERS` - Cancels specified orders on Jupiter.
* `GET_PRICE` - Fetch the current price of a Solana token in USD using Jupiter API.
* `GET_WALLET_ADDRESS` - Retrieve the wallet address from your private key.
* `GET_TOKEN_BALANCE` - Retrieve any SPL token balance on your wallet.
* `TRADE_TOKENS` - Trade tokens via Jupiter exchange.
* `GET_TPS` - Retrieve the current transactions per second (TPS) on the Solana network.
