import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EncodeObject } from '@cosmjs/proto-signing';
import type { StdFee } from '@cosmjs/stargate';

export type TxStatus = 'idle' | 'signing' | 'broadcasting' | 'success' | 'error';

export type TxType = 'governance' | 'send' | 'delegate' | 'vote' | 'other';

export interface Transaction {
  id: string;
  chainId: string;
  type: TxType;
  status: TxStatus;
  hash?: string;
  height?: number;
  timestamp: number;
  error?: string;
  messages: EncodeObject[];
  fee: StdFee;
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
  getTransactionsByChain: (chainId: string) => Transaction[];
  getTransactionsByType: (type: TxType) => Transaction[];
  getTransactionsByStatus: (status: TxStatus) => Transaction[];
  exportHistory: () => string;
  importHistory: (json: string) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      // Initial state
      transactions: [],
      currentTx: null,

      // Add new transaction
      addTransaction: (tx: Transaction) => {
        const { transactions } = get();
        // Keep only last 100 transactions
        const updatedTransactions = [tx, ...transactions].slice(0, 100);
        set({
          transactions: updatedTransactions,
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

      // Get transactions by chain
      getTransactionsByChain: (chainId: string) => {
        return get().transactions.filter((tx) => tx.chainId === chainId);
      },

      // Get transactions by type
      getTransactionsByType: (type: TxType) => {
        return get().transactions.filter((tx) => tx.type === type);
      },

      // Get transactions by status
      getTransactionsByStatus: (status: TxStatus) => {
        return get().transactions.filter((tx) => tx.status === status);
      },

      // Export transaction history as JSON
      exportHistory: () => {
        const { transactions } = get();
        return JSON.stringify(transactions, null, 2);
      },

      // Import transaction history from JSON
      importHistory: (json: string) => {
        try {
          const imported = JSON.parse(json) as Transaction[];
          const { transactions } = get();

          // Merge imported transactions, avoiding duplicates
          const existingIds = new Set(transactions.map((tx) => tx.id));
          const newTransactions = imported.filter((tx) => !existingIds.has(tx.id));

          // Combine and sort by timestamp, keep last 100
          const merged = [...transactions, ...newTransactions]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 100);

          set({ transactions: merged });
        } catch (error) {
          throw new Error(`Failed to import transaction history: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
        }
      },
    }),
    {
      name: 'transaction-history',
      version: 1,
    }
  )
);
