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
    chainId: string,
    messages: any[],
    fee: any,
    memo: string = ''
  ): Promise<string> {
    if (!this.keplr) {
      throw new Error('Keplr extension not installed');
    }

    // Get RPC endpoint from chain registry or config
    const key = await this.keplr.getKey(chainId);
    const offlineSigner = await this.getSigner(chainId);

    // This will need RPC endpoint from chain config
    // For now, we'll throw as this requires integration with chain store
    throw new Error('signAndBroadcast requires RPC endpoint from chain config');
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
