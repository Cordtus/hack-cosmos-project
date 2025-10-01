import type { Window as KeplrWindow } from '@keplr-wallet/types';
import type { AccountData, OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import type { WalletAdapter, ChainConfig } from './types';

declare global {
  interface Window extends KeplrWindow {}
}

export class KeplrWalletAdapter implements WalletAdapter {
  private keplr: typeof window.keplr | undefined;

  constructor() {
    this.keplr = window.keplr;
  }

  getName(): string {
    return 'Keplr';
  }

  isAvailable(): boolean {
    return !!window.keplr;
  }

  async connect(chainId: string): Promise<AccountData> {
    if (!this.keplr) {
      throw new Error('Keplr extension not installed');
    }

    // Enable Keplr for the chain
    await this.keplr.enable(chainId);

    // Get offline signer
    const offlineSigner = this.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    return accounts[0];
  }

  async disconnect(): Promise<void> {
    // Keplr doesn't have a disconnect method
    // User must disconnect from the extension
    return Promise.resolve();
  }

  async getSigner(chainId: string): Promise<OfflineSigner> {
    if (!this.keplr) {
      throw new Error('Keplr extension not installed');
    }

    await this.keplr.enable(chainId);
    return this.keplr.getOfflineSigner(chainId);
  }

  async signAndBroadcast(
    rpcEndpoint: string,
    chainId: string,
    messages: readonly import('@cosmjs/proto-signing').EncodeObject[],
    fee: import('@cosmjs/stargate').StdFee,
    memo: string = ''
  ): Promise<string> {
    if (!this.keplr) {
      throw new Error('Keplr extension not installed');
    }

    // Get signer
    const offlineSigner = await this.getSigner(chainId);
    const accounts = await offlineSigner.getAccounts();

    if (accounts.length === 0) {
      throw new Error('No accounts available');
    }

    // Create signing client
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      offlineSigner
    );

    try {
      // Broadcast transaction
      const result = await client.signAndBroadcast(
        accounts[0].address,
        messages,
        fee,
        memo
      );

      // Check for errors
      if (result.code !== 0) {
        throw new Error(`Transaction failed: ${result.rawLog || 'Unknown error'}`);
      }

      return result.transactionHash;
    } catch (error) {
      // Enhance error messages
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient funds to complete transaction');
        }
        if (error.message.includes('out of gas')) {
          throw new Error('Transaction ran out of gas. Try increasing gas limit.');
        }
        if (error.message.includes('rejected')) {
          throw new Error('Transaction rejected by user');
        }
      }
      throw error;
    }
  }

  async suggestChain(chainConfig: ChainConfig): Promise<void> {
    if (!this.keplr) {
      throw new Error('Keplr extension not installed');
    }

    // Transform our ChainConfig to Keplr's ChainInfo format
    const keplrChainInfo = {
      chainId: chainConfig.chainId,
      chainName: chainConfig.chainName,
      rpc: chainConfig.rpc,
      rest: chainConfig.rest,
      bip44: {
        coinType: 118, // Standard Cosmos coinType
      },
      bech32Config: {
        bech32PrefixAccAddr: chainConfig.bech32Prefix,
        bech32PrefixAccPub: `${chainConfig.bech32Prefix}pub`,
        bech32PrefixValAddr: `${chainConfig.bech32Prefix}valoper`,
        bech32PrefixValPub: `${chainConfig.bech32Prefix}valoperpub`,
        bech32PrefixConsAddr: `${chainConfig.bech32Prefix}valcons`,
        bech32PrefixConsPub: `${chainConfig.bech32Prefix}valconspub`,
      },
      currencies: [
        {
          coinDenom: chainConfig.coinDenom,
          coinMinimalDenom: chainConfig.coinMinimalDenom,
          coinDecimals: chainConfig.coinDecimals,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: chainConfig.coinDenom,
          coinMinimalDenom: chainConfig.coinMinimalDenom,
          coinDecimals: chainConfig.coinDecimals,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: chainConfig.coinDenom,
        coinMinimalDenom: chainConfig.coinMinimalDenom,
        coinDecimals: chainConfig.coinDecimals,
      },
      features: chainConfig.features || ['stargate', 'ibc-transfer'],
    };

    await this.keplr.experimentalSuggestChain(keplrChainInfo);
  }

  onAccountChange(
    chainId: string,
    callback: (newAccount: AccountData) => void
  ): () => void {
    if (!this.keplr) {
      return () => {}; // Return no-op cleanup function
    }

    const handler = async () => {
      try {
        // Re-fetch account when keystore changes
        const offlineSigner = this.keplr!.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        if (accounts.length > 0) {
          callback(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch account after keystore change:', error);
      }
    };

    window.addEventListener('keplr_keystorechange', handler);

    // Return cleanup function
    return () => {
      window.removeEventListener('keplr_keystorechange', handler);
    };
  }
}

export const keplrWallet = new KeplrWalletAdapter();
