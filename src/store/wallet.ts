import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WalletType = 'keplr' | 'leap' | 'ledger' | null;

export interface WalletAccount {
  address: string;
  pubkey: Uint8Array;
  algo: string;
}

interface WalletState {
  // Connection state
  walletType: WalletType;
  isConnected: boolean;
  account: WalletAccount | null;

  // Actions
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  setAccount: (account: WalletAccount) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      walletType: null,
      isConnected: false,
      account: null,

      // Connect wallet
      connect: async (walletType: WalletType) => {
        if (!walletType) return;

        try {
          // Connection logic will be implemented in wallet integration
          set({
            walletType,
            isConnected: true,
          });
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          throw error;
        }
      },

      // Disconnect wallet
      disconnect: () => {
        set({
          walletType: null,
          isConnected: false,
          account: null,
        });
      },

      // Set account details
      setAccount: (account: WalletAccount) => {
        set({ account });
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        walletType: state.walletType,
        isConnected: state.isConnected,
      }),
    }
  )
);
