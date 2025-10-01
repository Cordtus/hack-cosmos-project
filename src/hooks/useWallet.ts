import { useCallback } from 'react';
import { useWalletStore } from '@/store/wallet';
import { useChainStore } from '@/store/chain';
import { getWallet, getAvailableWallets, type WalletType } from '@/lib/wallet';

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
  };
}
