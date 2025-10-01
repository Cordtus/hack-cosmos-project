import type { AccountData, OfflineSigner } from '@cosmjs/proto-signing';
import type { WalletAdapter } from './types';

// Leap wallet uses similar API to Keplr
interface LeapWindow {
  leap?: {
    enable(chainId: string): Promise<void>;
    getOfflineSigner(chainId: string): OfflineSigner;
    getKey(chainId: string): Promise<{
      name: string;
      algo: string;
      pubKey: Uint8Array;
      address: Uint8Array;
      bech32Address: string;
    }>;
    experimentalSuggestChain(chainInfo: any): Promise<void>;
  };
}

declare global {
  interface Window extends LeapWindow {}
}

export class LeapWalletAdapter implements WalletAdapter {
  private leap: typeof window.leap | undefined;

  constructor() {
    this.leap = window.leap;
  }

  getName(): string {
    return 'Leap';
  }

  isAvailable(): boolean {
    return !!window.leap;
  }

  async connect(chainId: string): Promise<AccountData> {
    if (!this.leap) {
      throw new Error('Leap extension not installed');
    }

    // Enable Leap for the chain
    await this.leap.enable(chainId);

    // Get offline signer
    const offlineSigner = this.leap.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    return accounts[0];
  }

  async disconnect(): Promise<void> {
    // Leap doesn't have a disconnect method
    // User must disconnect from the extension
    return Promise.resolve();
  }

  async getSigner(chainId: string): Promise<OfflineSigner> {
    if (!this.leap) {
      throw new Error('Leap extension not installed');
    }

    await this.leap.enable(chainId);
    return this.leap.getOfflineSigner(chainId);
  }

  async signAndBroadcast(
    chainId: string,
    messages: any[],
    fee: any,
    memo: string = ''
  ): Promise<string> {
    if (!this.leap) {
      throw new Error('Leap extension not installed');
    }

    // Get RPC endpoint from chain registry or config
    const key = await this.leap.getKey(chainId);
    const offlineSigner = await this.getSigner(chainId);

    // This will need RPC endpoint from chain config
    // For now, we'll throw as this requires integration with chain store
    throw new Error('signAndBroadcast requires RPC endpoint from chain config');
  }

  async suggestChain(chainConfig: any): Promise<void> {
    if (!this.leap) {
      throw new Error('Leap extension not installed');
    }

    await this.leap.experimentalSuggestChain(chainConfig);
  }

  onAccountChange(callback: (accounts: readonly AccountData[]) => void): void {
    if (!this.leap) return;

    window.addEventListener('leap_keystorechange', async () => {
      // Re-fetch accounts when keystore changes
      // This requires chainId which should come from context
    });
  }
}

export const leapWallet = new LeapWalletAdapter();
