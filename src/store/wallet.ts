import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Supported wallet types for Cosmos SDK chains
 */
export type WalletType = 'keplr' | 'leap' | 'ledger' | null;

/**
 * Wallet account information
 *
 * @interface WalletAccount
 * @property {string} address - Bech32-encoded account address
 * @property {Uint8Array} pubkey - Account public key bytes
 * @property {string} algo - Signature algorithm (e.g., 'secp256k1', 'ed25519')
 */
export interface WalletAccount {
  address: string;
  pubkey: Uint8Array;
  algo: string;
}

/**
 * Wallet state management interface
 *
 * @interface WalletState
 * @property {WalletType} walletType - Currently connected wallet type
 * @property {boolean} isConnected - Connection status
 * @property {WalletAccount | null} account - Current account details
 * @property {Function} connect - Connect to a wallet
 * @property {Function} disconnect - Disconnect current wallet
 * @property {Function} setAccount - Update account information
 */
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

/**
 * Global wallet state store with persistence
 *
 * @description
 * Zustand store for managing wallet connection state across the application.
 * Persists connection state to localStorage to maintain sessions across refreshes.
 * Only connection metadata is persisted, not sensitive data like private keys.
 *
 * @example
 * ```tsx
 * // In a React component
 * function WalletInfo() {
 *   const { account, isConnected } = useWalletStore();
 *
 *   if (!isConnected) return <div>Not connected</div>;
 *   return <div>Connected: {account?.address}</div>;
 * }
 *
 * // Outside React components
 * const account = useWalletStore.getState().account;
 * useWalletStore.getState().disconnect();
 * ```
 */
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
