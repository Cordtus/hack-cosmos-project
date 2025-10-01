import { bech32 } from 'bech32';
import { fromHex, toHex } from '@cosmjs/encoding';

/**
 * Convert Cosmos bech32 address to EVM hex address
 * @example cosmosToEvm('cosmos1abc...') => '0x1234...'
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
 * Convert EVM hex address to Cosmos bech32 address
 * @example evmToCosmos('0x1234...', 'cosmos') => 'cosmos1abc...'
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
 * Validate Cosmos bech32 address
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
 * Validate EVM hex address
 */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Shorten address for display
 * @example shortenAddress('cosmos1abc...xyz', 8, 6) => 'cosmos1a...nsr700'
 */
export function shortenAddress(address: string, startChars: number = 10, endChars: number = 6): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get address prefix from bech32 address
 */
export function getAddressPrefix(address: string): string {
  try {
    const { prefix } = bech32.decode(address);
    return prefix;
  } catch {
    throw new Error(`Invalid bech32 address: ${address}`);
  }
}
