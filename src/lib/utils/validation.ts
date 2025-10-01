/**
 * @fileoverview Validation schemas and utilities
 * Zod-based validation schemas for common blockchain data types including addresses,
 * amounts, gas, and various protocol-specific formats.
 */

import { z } from 'zod';
import { isValidCosmosAddress, isValidEvmAddress } from './address';

/**
 * Zod schema for Cosmos bech32 address validation.
 * Validates address format and optional prefix matching.
 *
 * @param {string} [prefix] - Optional bech32 prefix to enforce (e.g., "cosmos", "evmos")
 * @returns {z.ZodEffects<z.ZodString>} Zod schema for address validation
 * @example
 * const schema = cosmosAddressSchema('cosmos');
 * schema.parse('cosmos1abc123...'); // Valid
 * schema.parse('evmos1abc123...'); // Throws error - wrong prefix
 */
export const cosmosAddressSchema = (prefix?: string) =>
  z.string().refine((val) => isValidCosmosAddress(val, prefix), {
    message: prefix ? `Invalid ${prefix} address` : 'Invalid Cosmos address',
  });

/**
 * Zod schema for EVM address validation.
 * Validates 0x-prefixed hex addresses with checksum.
 *
 * @example
 * evmAddressSchema.parse('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'); // Valid
 * evmAddressSchema.parse('0xinvalid'); // Throws error
 */
export const evmAddressSchema = z.string().refine(isValidEvmAddress, {
  message: 'Invalid EVM address (must be 0x followed by 40 hex characters)',
});

/**
 * Zod schema for coin amount validation.
 * Ensures amount is a positive integer string (as required by Cosmos SDK).
 *
 * @example
 * coinAmountSchema.parse('1000000'); // Valid
 * coinAmountSchema.parse('1.5'); // Throws error - no decimals
 * coinAmountSchema.parse('0'); // Throws error - must be positive
 */
export const coinAmountSchema = z
  .string()
  .refine((val) => /^\d+$/.test(val), {
    message: 'Amount must be a positive integer',
  })
  .refine((val) => BigInt(val) > 0, {
    message: 'Amount must be greater than 0',
  });

/**
 * Zod schema for coin object validation.
 * Validates full Cosmos SDK coin structure with amount and denomination.
 *
 * @example
 * coinSchema.parse({ amount: '1000000', denom: 'uatom' }); // Valid
 * coinSchema.parse({ amount: '1000000', denom: 'a' }); // Throws error - denom too short
 */
export const coinSchema = z.object({
  amount: coinAmountSchema,
  denom: z.string().min(3).max(128),
});

/**
 * Zod schema for decimal percentage validation (0-1 range).
 * Used for rates, fractions, and proportions.
 *
 * @example
 * percentageSchema.parse('0.5'); // Valid - 50%
 * percentageSchema.parse('0.025'); // Valid - 2.5%
 * percentageSchema.parse('1.5'); // Throws error - exceeds 1
 */
export const percentageSchema = z
  .string()
  .refine((val) => /^\d*\.?\d+$/.test(val), {
    message: 'Must be a valid decimal number',
  })
  .refine((val) => {
    const num = parseFloat(val);
    return num >= 0 && num <= 1;
  }, {
    message: 'Must be between 0 and 1',
  });

/**
 * Zod schema for gas amount validation.
 * Ensures gas is a positive integer within reasonable bounds.
 *
 * @example
 * gasSchema.parse(200000); // Valid
 * gasSchema.parse(0); // Throws error - must be positive
 * gasSchema.parse(20000000); // Throws error - exceeds maximum
 */
export const gasSchema = z
  .number()
  .int()
  .positive()
  .min(1)
  .max(10000000);

/**
 * Zod schema for transaction memo validation.
 * Enforces Cosmos SDK memo length limit of 256 characters.
 *
 * @example
 * memoSchema.parse('Payment for services'); // Valid
 * memoSchema.parse(undefined); // Valid - memo is optional
 * memoSchema.parse('a'.repeat(300)); // Throws error - exceeds limit
 */
export const memoSchema = z.string().max(256).optional();

/**
 * Validate if a string is valid JSON.
 * Safe JSON parsing without throwing errors.
 *
 * @param {string} str - String to validate
 * @returns {boolean} True if valid JSON, false otherwise
 * @example
 * isValidJson('{"key": "value"}'); // Returns: true
 * isValidJson('invalid json'); // Returns: false
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Zod schema for governance proposal ID validation.
 * Ensures proposal ID is a positive integer.
 *
 * @example
 * proposalIdSchema.parse(42); // Valid
 * proposalIdSchema.parse(0); // Throws error - must be positive
 */
export const proposalIdSchema = z.number().int().positive();

/**
 * Zod schema for IBC channel ID validation.
 * Validates format: channel-{number}.
 *
 * @example
 * ibcChannelSchema.parse('channel-0'); // Valid
 * ibcChannelSchema.parse('channel-42'); // Valid
 * ibcChannelSchema.parse('invalid'); // Throws error
 */
export const ibcChannelSchema = z
  .string()
  .regex(/^channel-\d+$/, {
    message: 'IBC channel must be in format: channel-{number}',
  });

/**
 * Zod schema for duration string validation.
 * Validates format: {number}{unit} where unit is s, m, h, or d.
 *
 * @example
 * durationSchema.parse('300s'); // Valid - 300 seconds
 * durationSchema.parse('5m'); // Valid - 5 minutes
 * durationSchema.parse('24h'); // Valid - 24 hours
 * durationSchema.parse('7d'); // Valid - 7 days
 */
export const durationSchema = z
  .string()
  .regex(/^\d+[smhd]$/, {
    message: 'Duration must be a number followed by s, m, h, or d',
  });

/**
 * Zod schema for hex string validation.
 * Validates 0x-prefixed hexadecimal strings.
 *
 * @example
 * hexSchema.parse('0x1234abcd'); // Valid
 * hexSchema.parse('0xABCDEF'); // Valid
 * hexSchema.parse('1234'); // Throws error - missing 0x prefix
 */
export const hexSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]+$/, {
    message: 'Must be a valid hex string starting with 0x',
  });

/**
 * Zod schema for URL validation.
 * Validates full URL format including protocol.
 *
 * @example
 * urlSchema.parse('https://example.com'); // Valid
 * urlSchema.parse('example.com'); // Throws error - missing protocol
 */
export const urlSchema = z.string().url();

/**
 * Zod schema for email validation.
 * Validates email address format.
 *
 * @example
 * emailSchema.parse('user@example.com'); // Valid
 * emailSchema.parse('invalid-email'); // Throws error
 */
export const emailSchema = z.string().email();
