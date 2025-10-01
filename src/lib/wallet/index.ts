import type { WalletAdapter } from './types';
import { keplrWallet } from './keplr';
import { leapWallet } from './leap';
import { ledgerWallet } from './ledger';

export * from './types';
export { keplrWallet } from './keplr';
export { leapWallet } from './leap';
export { ledgerWallet } from './ledger';

export type WalletType = 'keplr' | 'leap' | 'ledger';

export const WALLETS: Record<WalletType, WalletAdapter> = {
  keplr: keplrWallet,
  leap: leapWallet,
  ledger: ledgerWallet,
};

export function getWallet(type: WalletType): WalletAdapter {
  return WALLETS[type];
}

export function getAvailableWallets(): WalletType[] {
  return (Object.keys(WALLETS) as WalletType[]).filter((type) =>
    WALLETS[type].isAvailable()
  );
}
