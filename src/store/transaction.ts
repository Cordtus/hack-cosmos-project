import { create } from 'zustand';

export type TxStatus = 'idle' | 'signing' | 'broadcasting' | 'success' | 'error';

export interface Transaction {
  id: string;
  type: string;
  status: TxStatus;
  hash?: string;
  height?: number;
  timestamp: number;
  error?: string;
  messages: any[];
  fee?: {
    amount: { amount: string; denom: string }[];
    gas: string;
  };
  memo?: string;
}

interface TransactionState {
  // Transaction history
  transactions: Transaction[];
  currentTx: Transaction | null;

  // Actions
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setCurrentTx: (tx: Transaction | null) => void;
  clearHistory: () => void;
  getTransaction: (id: string) => Transaction | undefined;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Initial state
  transactions: [],
  currentTx: null,

  // Add new transaction
  addTransaction: (tx: Transaction) => {
    const { transactions } = get();
    set({
      transactions: [tx, ...transactions],
      currentTx: tx,
    });
  },

  // Update transaction
  updateTransaction: (id: string, updates: Partial<Transaction>) => {
    const { transactions, currentTx } = get();
    set({
      transactions: transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
      currentTx: currentTx?.id === id ? { ...currentTx, ...updates } : currentTx,
    });
  },

  // Set current transaction
  setCurrentTx: (tx: Transaction | null) => {
    set({ currentTx: tx });
  },

  // Clear transaction history
  clearHistory: () => {
    set({ transactions: [], currentTx: null });
  },

  // Get transaction by ID
  getTransaction: (id: string) => {
    return get().transactions.find((tx) => tx.id === id);
  },
}));
