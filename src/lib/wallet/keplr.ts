import type { Window as KeplrWindow } from '@keplr-wallet/types';
import type { AccountData, OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import type { WalletAdapter } from './types';

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

  async suggestChain(chainConfig: any): Promise<void> {
    if (!this.keplr) {
      throw new Error('Keplr extension not installed');
    }

    await this.keplr.experimentalSuggestChain(chainConfig);
  }

  onAccountChange(callback: (accounts: readonly AccountData[]) => void): void {
    if (!this.keplr) return;

    window.addEventListener('keplr_keystorechange', async () => {
      // Re-fetch accounts when keystore changes
      // This requires chainId which should come from context
    });
  }
}

export const keplrWallet = new KeplrWalletAdapter();
