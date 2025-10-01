/**
 * @fileoverview Wallet adapter registry
 * Central registry for all wallet implementations. Provides wallet selection,
 * availability checking, and adapter retrieval.
 */

import type { WalletAdapter } from './types';
import { keplrWallet } from './keplr';
import { leapWallet } from './leap';
import { ledgerWallet } from './ledger';

export * from './types';
export { keplrWallet } from './keplr';
export { leapWallet } from './leap';
export { ledgerWallet } from './ledger';

/**
 * Supported wallet types.
 * @typedef {'keplr' | 'leap' | 'ledger'} WalletType
 */
export type WalletType = 'keplr' | 'leap' | 'ledger';

/**
 * Registry of all wallet adapters.
 * Maps wallet type to adapter instance.
 */
export const WALLETS: Record<WalletType, WalletAdapter> = {
  keplr: keplrWallet,
  leap: leapWallet,
  ledger: ledgerWallet,
};

/**
 * Get wallet adapter by type.
 * Retrieves the appropriate wallet adapter instance.
 *
 * @param {WalletType} type - Wallet type to retrieve
 * @returns {WalletAdapter} Wallet adapter instance
 * @example
 * const wallet = getWallet('keplr');
 * await wallet.connect('cosmoshub-4');
 */
export function getWallet(type: WalletType): WalletAdapter {
  return WALLETS[type];
}

/**
 * Get list of available wallets.
 * Checks which wallet extensions are installed and available in the browser.
 *
 * @returns {WalletType[]} Array of available wallet types
 * @example
 * const available = getAvailableWallets();
 * // Returns: ['keplr', 'leap'] if both extensions are installed
 */
export function getAvailableWallets(): WalletType[] {
  return (Object.keys(WALLETS) as WalletType[]).filter((type) =>
    WALLETS[type].isAvailable()
  );
}
