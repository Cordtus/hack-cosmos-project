/**
 * @fileoverview Wallet adapter type definitions
 * Common interface for all wallet integrations (Keplr, Leap, Ledger).
 */

import type { AccountData, OfflineSigner } from '@cosmjs/proto-signing';

/**
 * Common interface for wallet adapters.
 * All wallet implementations (Keplr, Leap, Ledger) must implement this interface.
 *
 * @interface WalletAdapter
 */
export interface WalletAdapter {
  /**
   * Connect to the wallet and retrieve account information.
   * @param {string} chainId - The chain ID to connect to
   * @returns {Promise<AccountData>} Account data including address and pubkey
   */
  connect(chainId: string): Promise<AccountData>;

  /**
   * Disconnect from the wallet and cleanup resources.
   * @returns {Promise<void>}
   */
  disconnect(): Promise<void>;

  /**
   * Get an offline signer for transaction signing.
   * @param {string} chainId - The chain ID
   * @returns {Promise<OfflineSigner>} CosmJS offline signer
   */
  getSigner(chainId: string): Promise<OfflineSigner>;

  /**
   * Sign and broadcast a transaction.
   * @param {string} chainId - The chain ID
   * @param {any[]} messages - Array of Cosmos SDK messages
   * @param {any} fee - Transaction fee object
   * @param {string} [memo] - Optional transaction memo
   * @returns {Promise<string>} Transaction hash
   */
  signAndBroadcast(chainId: string, messages: any[], fee: any, memo?: string): Promise<string>;

  /**
   * Check if the wallet extension is available in the browser.
   * @returns {boolean} True if wallet is available
   */
  isAvailable(): boolean;

  /**
   * Get the wallet name for display purposes.
   * @returns {string} Wallet name (e.g., "Keplr", "Leap")
   */
  getName(): string;
}

/**
 * Wallet-specific error type with optional error code and data.
 *
 * @interface WalletError
 * @extends {Error}
 */
export interface WalletError extends Error {
  /** Optional error code from the wallet */
  code?: string;
  /** Additional error data */
  data?: any;
}

/**
 * Wallet event types for event listeners.
 * @typedef {'accountsChanged' | 'chainChanged' | 'disconnect'} WalletEventType
 */
export type WalletEventType = 'accountsChanged' | 'chainChanged' | 'disconnect';

/**
 * Wallet event listener function signature.
 *
 * @interface WalletEventListener
 * @param {WalletEventType} event - The event type
 * @param {any} [data] - Optional event data
 */
export interface WalletEventListener {
  (event: WalletEventType, data?: any): void;
}
