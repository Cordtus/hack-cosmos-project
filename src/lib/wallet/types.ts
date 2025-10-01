import type { AccountData, OfflineSigner } from '@cosmjs/proto-signing';

export interface WalletAdapter {
  connect(chainId: string): Promise<AccountData>;
  disconnect(): Promise<void>;
  getSigner(chainId: string): Promise<OfflineSigner>;
  signAndBroadcast(chainId: string, messages: any[], fee: any, memo?: string): Promise<string>;
  isAvailable(): boolean;
  getName(): string;
}

export interface WalletError extends Error {
  code?: string;
  data?: any;
}

export type WalletEventType = 'accountsChanged' | 'chainChanged' | 'disconnect';

export interface WalletEventListener {
  (event: WalletEventType, data?: any): void;
}
