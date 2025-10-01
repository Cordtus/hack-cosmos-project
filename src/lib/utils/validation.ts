import { z } from 'zod';
import { isValidCosmosAddress, isValidEvmAddress } from './address';

/**
 * Zod schema for Cosmos address
 */
export const cosmosAddressSchema = (prefix?: string) =>
  z.string().refine((val) => isValidCosmosAddress(val, prefix), {
    message: prefix ? `Invalid ${prefix} address` : 'Invalid Cosmos address',
  });

/**
 * Zod schema for EVM address
 */
export const evmAddressSchema = z.string().refine(isValidEvmAddress, {
  message: 'Invalid EVM address (must be 0x followed by 40 hex characters)',
});

/**
 * Zod schema for coin amount
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
 * Zod schema for coin object
 */
export const coinSchema = z.object({
  amount: coinAmountSchema,
  denom: z.string().min(3).max(128),
});

/**
 * Zod schema for decimal percentage (0-1)
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
 * Zod schema for gas amount
 */
export const gasSchema = z
  .number()
  .int()
  .positive()
  .min(1)
  .max(10000000);

/**
 * Zod schema for memo field
 */
export const memoSchema = z.string().max(256).optional();

/**
 * Validate JSON string
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
 * Validate proposal ID
 */
export const proposalIdSchema = z.number().int().positive();

/**
 * Validate IBC channel ID
 */
export const ibcChannelSchema = z
  .string()
  .regex(/^channel-\d+$/, {
    message: 'IBC channel must be in format: channel-{number}',
  });

/**
 * Validate duration string (e.g., "300s", "5m")
 */
export const durationSchema = z
  .string()
  .regex(/^\d+[smhd]$/, {
    message: 'Duration must be a number followed by s, m, h, or d',
  });

/**
 * Validate hex string
 */
export const hexSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]+$/, {
    message: 'Must be a valid hex string starting with 0x',
  });

/**
 * Validate URL
 */
export const urlSchema = z.string().url();

/**
 * Validate email
 */
export const emailSchema = z.string().email();
