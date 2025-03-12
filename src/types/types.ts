export interface CreateOrderRequest {
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
  computeUnitPrice?: string | 'auto';
  referral?: string;
  wrapAndUnwrapSol?: boolean;
}

export interface CreateOrderResponse {
  order: string;
  tx: string;
}

export interface OpenOrderAccount {
  borrowMakingAmount: string;
  createdAt: string;
  expiredAt: string | null;
  makingAmount: string;
  oriMakingAmount: string;
  oriTakingAmount: string;
  takingAmount: string;
  uniqueId: string;
  updatedAt: string;
  feeAccount: string;
  inputMint: string;
  inputMintReserve: string;
  inputTokenProgram: string;
  maker: string;
  outputMint: string;
  outputTokenProgram: string;
  feeBps: number;
  bump: number;
}

export interface OpenOrderResponse {
  account: OpenOrderAccount;
  publicKey: string;
}

export interface CancelOrderRequest {
  maker: string;
  computeUnitPrice?: string | 'auto';
  orders?: string[];
}

export interface CancelOrderResponse {
  txs: string[];
}

export interface Trade {
  // Add trade details as needed
  amount: string;
  price: string;
  timestamp: string;
}

export interface OrderHistoryItem {
  userPubkey: string;
  orderKey: string;
  inputMint: string;
  outputMint: string;
  makingAmount: string;
  takingAmount: string;
  remainingMakingAmount: string;
  remainingTakingAmount: string;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'Open' | 'Completed' | 'Cancelled';
  openTx: string;
  closeTx: string;
  programVersion: string;
  trades: Trade[];
}

export interface OrderHistoryResponse {
  orders: OrderHistoryItem[];
  hasMoreData: boolean;
  page: number;
}
