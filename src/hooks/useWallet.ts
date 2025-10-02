import { useCallback, useEffect } from 'react';
import { useWalletStore } from '@/store/wallet';
import { useChainStore } from '@/store/chain';
import { getWallet, getAvailableWallets, type WalletType } from '@/lib/wallet';
import type { ChainConfig } from '@/lib/wallet/types';

/**
 * React hook for wallet management in Cosmos SDK applications
 *
 * @description
 * Provides a comprehensive interface for wallet operations including connection,
 * disconnection, signing, and transaction broadcasting. Supports multiple wallet
 * types (Keplr, Leap, Ledger) with automatic account change detection.
 *
 * @example
 * ```tsx
 * function WalletButton() {
 *   const { isConnected, account, connect, disconnect } = useWallet();
 *
 *   if (isConnected) {
 *     return (
 *       <div>
 *         <span>{account.address}</span>
 *         <button onClick={disconnect}>Disconnect</button>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <button onClick={() => connect('keplr')}>
 *       Connect Wallet
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns {Object} Wallet state and action methods
 * @returns {WalletType | null} walletType - Currently connected wallet type
 * @returns {boolean} isConnected - Whether a wallet is connected
 * @returns {Account | null} account - Current account information
 * @returns {WalletType[]} availableWallets - List of detected wallet extensions
 * @returns {Function} connect - Connect to a specific wallet type
 * @returns {Function} disconnect - Disconnect current wallet
 * @returns {Function} getSigner - Get offline signer for transaction signing
 * @returns {Function} signAndBroadcast - Sign and broadcast transactions
 * @returns {Function} suggestChain - Suggest chain configuration to wallet
 */
export function useWallet() {
  const {
    walletType,
    isConnected,
    account,
    setAccount,
    disconnect: disconnectStore,
  } = useWalletStore();

  const { selectedChain } = useChainStore();

  const connect = useCallback(
    async (type: WalletType) => {
      if (!selectedChain) {
        throw new Error('No chain selected');
      }

      const wallet = getWallet(type);

      if (!wallet.isAvailable()) {
        throw new Error(`${wallet.getName()} wallet not available`);
      }

      try {
        // Connect to wallet
        const accountData = await wallet.connect(selectedChain.chainId);

        // Update store
        useWalletStore.getState().connect(type);
        setAccount(accountData);

        return accountData;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    },
    [selectedChain, setAccount]
  );

  const disconnect = useCallback(async () => {
    if (walletType) {
      const wallet = getWallet(walletType);
      await wallet.disconnect();
    }
    disconnectStore();
  }, [walletType, disconnectStore]);

  const getSigner = useCallback(async () => {
    if (!walletType || !selectedChain) {
      throw new Error('Wallet not connected or no chain selected');
    }

    const wallet = getWallet(walletType);
    return wallet.getSigner(selectedChain.chainId);
  }, [walletType, selectedChain]);

  const signAndBroadcast = useCallback(
    async (
      messages: readonly import('@cosmjs/proto-signing').EncodeObject[],
      fee: import('@cosmjs/stargate').StdFee,
      memo?: string
    ) => {
      if (!walletType || !selectedChain) {
        throw new Error('Wallet not connected or no chain selected');
      }

      const wallet = getWallet(walletType);
      return wallet.signAndBroadcast(
        selectedChain.rpc,
        selectedChain.chainId,
        messages,
        fee,
        memo
      );
    },
    [walletType, selectedChain]
  );

  const suggestChain = useCallback(
    async (chainConfig: ChainConfig) => {
      if (!walletType) {
        throw new Error('Wallet not connected');
      }

      const wallet = getWallet(walletType);
      if (!wallet.suggestChain) {
        throw new Error(`${wallet.getName()} does not support suggestChain`);
      }

      return wallet.suggestChain(chainConfig);
    },
    [walletType]
  );

  // Set up account change listener
  useEffect(() => {
    if (!walletType || !isConnected || !selectedChain) {
      return;
    }

    const wallet = getWallet(walletType);
    if (!wallet.onAccountChange) {
      return; // Wallet doesn't support account change events
    }

    const cleanup = wallet.onAccountChange(selectedChain.chainId, (newAccount) => {
      setAccount(newAccount);
    });

    return cleanup;
  }, [walletType, isConnected, selectedChain, setAccount]);

  const availableWallets = getAvailableWallets();

  return {
    // State
    walletType,
    isConnected,
    account,
    availableWallets,

    // Actions
    connect,
    disconnect,
    getSigner,
    signAndBroadcast,
    suggestChain,
  };
}
