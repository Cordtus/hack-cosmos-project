/**
 * @fileoverview Wallet adapter type definitions
 * Common interface for all wallet integrations (Keplr, Leap, Ledger).
 */

import type { AccountData, OfflineSigner, EncodeObject } from '@cosmjs/proto-signing';
import type { StdFee } from '@cosmjs/stargate';

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
   * @param {string} rpcEndpoint - RPC endpoint for broadcasting
   * @param {string} chainId - The chain ID
   * @param {readonly EncodeObject[]} messages - Array of properly typed Cosmos SDK messages
   * @param {StdFee} fee - Transaction fee object with proper structure
   * @param {string} [memo] - Optional transaction memo
   * @returns {Promise<string>} Transaction hash
   */
  signAndBroadcast(
    rpcEndpoint: string,
    chainId: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo?: string
  ): Promise<string>;

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

  /**
   * Suggest a chain to the wallet if not already configured.
   * Prompts the user to add the chain to their wallet.
   * Optional - not all wallets support this feature.
   * @param {ChainConfig} chainConfig - Complete chain configuration
   * @returns {Promise<void>}
   */
  suggestChain?(chainConfig: ChainConfig): Promise<void>;

  /**
   * Set up account change listener.
   * Callback is invoked when user switches accounts in the wallet extension.
   * Optional - not all wallets support this feature.
   * @param {string} chainId - Chain ID to listen for account changes on
   * @param {(newAccount: AccountData) => void} callback - Function called when account changes
   * @returns {() => void} Cleanup function to remove the listener
   */
  onAccountChange?(
    chainId: string,
    callback: (newAccount: AccountData) => void
  ): () => void;
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

/**
 * Chain configuration for suggestChain functionality.
 * Contains all parameters needed to add a chain to a wallet.
 *
 * @interface ChainConfig
 */
export interface ChainConfig {
  /** Chain ID (e.g., "cosmoshub-4") */
  chainId: string;
  /** Human-readable chain name (e.g., "Cosmos Hub") */
  chainName: string;
  /** RPC endpoint URL */
  rpc: string;
  /** REST API endpoint URL */
  rest: string;
  /** Bech32 address prefix (e.g., "cosmos") */
  bech32Prefix: string;
  /** Display denomination (e.g., "ATOM") */
  coinDenom: string;
  /** Minimal denomination for transactions (e.g., "uatom") */
  coinMinimalDenom: string;
  /** Number of decimal places (e.g., 6) */
  coinDecimals: number;
  /** Gas price string (e.g., "0.025uatom") */
  gasPrice: string;
  /** Optional chain features (e.g., ["stargate", "ibc-transfer"]) */
  features?: string[];
}
