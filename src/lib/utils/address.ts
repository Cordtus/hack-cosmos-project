/**
 * @fileoverview Address conversion and validation utilities
 * Handles conversion between Cosmos bech32 and EVM hex address formats,
 * plus validation and formatting functions.
 */

import { bech32 } from 'bech32';
import { fromHex, toHex } from '@cosmjs/encoding';

/**
 * Convert Cosmos bech32 address to EVM hex address.
 * Decodes the bech32 address and converts the data to hex format.
 *
 * @param {string} cosmosAddress - Bech32-encoded Cosmos address
 * @returns {string} 0x-prefixed hex address
 * @throws {Error} If the address is invalid
 * @example
 * cosmosToEvm('cosmos1abc...') // Returns: '0x1234...'
 */
export function cosmosToEvm(cosmosAddress: string): string {
  try {
    const { words } = bech32.decode(cosmosAddress);
    const data = bech32.fromWords(words);
    return '0x' + toHex(new Uint8Array(data));
  } catch (error) {
    throw new Error(`Invalid cosmos address: ${cosmosAddress}`);
  }
}

/**
 * Convert EVM hex address to Cosmos bech32 address.
 * Decodes the hex address and encodes it with the specified bech32 prefix.
 *
 * @param {string} evmAddress - 0x-prefixed hex address
 * @param {string} [prefix='cosmos'] - Bech32 prefix (e.g., 'cosmos', 'cosmos', 'osmo')
 * @returns {string} Bech32-encoded address with the specified prefix
 * @throws {Error} If the address is invalid
 * @example
 * evmToCosmos('0x1234...', 'cosmos') // Returns: 'cosmos1abc...'
 * evmToCosmos('0x1234...', 'cosmos') // Returns: 'cosmos1abc...'
 */
export function evmToCosmos(evmAddress: string, prefix: string = 'cosmos'): string {
  try {
    const normalized = evmAddress.toLowerCase().replace('0x', '');
    const data = fromHex(normalized);
    const words = bech32.toWords(data);
    return bech32.encode(prefix, words);
  } catch (error) {
    throw new Error(`Invalid EVM address: ${evmAddress}`);
  }
}

/**
 * Validate Cosmos bech32 address.
 * Checks if the address is properly formatted and optionally matches a specific prefix.
 *
 * @param {string} address - Address to validate
 * @param {string} [prefix] - Optional prefix to match (e.g., 'cosmos', 'cosmos')
 * @returns {boolean} True if valid, false otherwise
 * @example
 * isValidCosmosAddress('cosmos1abc...') // Returns: true
 * isValidCosmosAddress('cosmos1abc...', 'cosmos') // Returns: false (prefix mismatch)
 */
export function isValidCosmosAddress(address: string, prefix?: string): boolean {
  try {
    const decoded = bech32.decode(address);
    if (prefix && decoded.prefix !== prefix) return false;
    return decoded.words.length > 0;
  } catch {
    return false;
  }
}

/**
 * Validate EVM hex address.
 * Checks if the address matches the 0x-prefixed 40-character hex format.
 *
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid EVM address, false otherwise
 * @example
 * isValidEvmAddress('0x1234567890123456789012345678901234567890') // Returns: true
 * isValidEvmAddress('0x123') // Returns: false (too short)
 */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Shorten address for display purposes.
 * Truncates the middle portion of the address for compact UI display.
 *
 * @param {string} address - Full address to shorten
 * @param {number} [startChars=10] - Number of characters to keep at the start
 * @param {number} [endChars=6] - Number of characters to keep at the end
 * @returns {string} Shortened address with ellipsis
 * @example
 * shortenAddress('cosmos1abc...xyz', 8, 6) // Returns: 'cosmos1a...nsr700'
 */
export function shortenAddress(address: string, startChars: number = 10, endChars: number = 6): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get address prefix from bech32 address.
 * Extracts the human-readable prefix (e.g., 'cosmos', 'cosmos') from a bech32 address.
 *
 * @param {string} address - Bech32 address
 * @returns {string} The address prefix
 * @throws {Error} If the address is invalid
 * @example
 * getAddressPrefix('cosmos1abc...') // Returns: 'cosmos'
 * getAddressPrefix('cosmos1xyz...') // Returns: 'cosmos'
 */
export function getAddressPrefix(address: string): string {
  try {
    const { prefix } = bech32.decode(address);
    return prefix;
  } catch {
    throw new Error(`Invalid bech32 address: ${address}`);
  }
}
