/**
 * @fileoverview Transaction builder utilities
 * Helpers for constructing Cosmos SDK transactions with proper fee structure and gas estimation.
 */

import type { EncodeObject } from '@cosmjs/proto-signing';
import type { StdFee, Coin } from '@cosmjs/stargate';

/**
 * Build a standard transaction fee object from gas limit and price.
 *
 * @param {number} gasLimit - The gas limit for the transaction
 * @param {string} gasPrice - Gas price in format "0.025uatom" (amount + denom)
 * @param {string} [payer] - Optional fee payer address
 * @param {string} [granter] - Optional fee granter address
 * @returns {StdFee} Properly formatted transaction fee
 * @throws {Error} If gas price format is invalid
 * @example
 * const fee = buildFee(200000, "0.025uatom");
 * // Returns: { amount: [{ amount: "5000", denom: "uatom" }], gas: "200000" }
 */
export function buildFee(
  gasLimit: number,
  gasPrice: string,
  payer?: string,
  granter?: string
): StdFee {
  // Parse gas price (e.g., "0.025uatom" or "25000000000aatom")
  const match = gasPrice.match(/^([\d.]+)(.+)$/);
  if (!match) {
    throw new Error(`Invalid gas price format: ${gasPrice}. Expected format: "0.025uatom"`);
  }

  const [, price, denom] = match;
  const priceNum = parseFloat(price);

  if (isNaN(priceNum) || priceNum < 0) {
    throw new Error(`Invalid gas price value: ${price}`);
  }

  // Calculate total fee amount
  const amount = Math.ceil(gasLimit * priceNum).toString();

  const fee: StdFee = {
    amount: [{ amount, denom }],
    gas: gasLimit.toString(),
    ...(payer && { payer }),
    ...(granter && { granter }),
  };

  return fee;
}

/**
 * Estimate gas required for a set of messages.
 * Uses heuristic-based estimation. For production, should use simulation.
 *
 * @param {readonly EncodeObject[]} messages - Array of messages to estimate
 * @param {number} [baseGas=100000] - Base gas per transaction
 * @param {number} [gasPerMessage=50000] - Gas per message
 * @param {number} [buffer=1.2] - Safety buffer multiplier (default 20%)
 * @returns {number} Estimated gas limit
 * @example
 * const messages = [{ typeUrl: '/cosmos.bank.v1beta1.MsgSend', value: {...} }];
 * const gasLimit = estimateGas(messages);
 * // Returns: ~180000 (100k base + 50k per msg + 20% buffer)
 */
export function estimateGas(
  messages: readonly EncodeObject[],
  baseGas: number = 100_000,
  gasPerMessage: number = 50_000,
  buffer: number = 1.2
): number {
  // Start with base gas
  let gas = baseGas;

  // Add gas per message
  gas += messages.length * gasPerMessage;

  // Add gas based on message complexity (size-based heuristic)
  messages.forEach(msg => {
    try {
      const size = JSON.stringify(msg.value).length;
      // Add ~1000 gas per 100 bytes of message data
      gas += Math.ceil(size / 100) * 1000;
    } catch {
      // If can't serialize, just use fixed overhead
      gas += 10_000;
    }
  });

  // Apply safety buffer
  return Math.ceil(gas * buffer);
}

/**
 * Calculate fee amount from gas limit and price.
 * Helper for displaying fee estimates to users.
 *
 * @param {number} gasLimit - Gas limit
 * @param {string} gasPrice - Gas price string (e.g., "0.025uatom")
 * @returns {{amount: string, denom: string}} Fee amount and denomination
 * @example
 * const fee = calculateFeeAmount(200000, "0.025uatom");
 * // Returns: { amount: "5000", denom: "uatom" }
 */
export function calculateFeeAmount(
  gasLimit: number,
  gasPrice: string
): { amount: string; denom: string } {
  const fee = buildFee(gasLimit, gasPrice);
  return fee.amount[0];
}

/**
 * Validate fee structure.
 * Ensures fee has required properties and valid values.
 *
 * @param {StdFee} fee - Fee object to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails with descriptive message
 */
export function validateFee(fee: StdFee): boolean {
  if (!fee || typeof fee !== 'object') {
    throw new Error('Fee must be an object');
  }

  if (!Array.isArray(fee.amount)) {
    throw new Error('Fee amount must be an array');
  }

  if (fee.amount.length === 0) {
    throw new Error('Fee amount cannot be empty');
  }

  fee.amount.forEach((coin, idx) => {
    if (!coin.amount || !coin.denom) {
      throw new Error(`Fee amount[${idx}] must have amount and denom`);
    }

    const amount = BigInt(coin.amount);
    if (amount < 0n) {
      throw new Error(`Fee amount[${idx}] cannot be negative`);
    }
  });

  if (!fee.gas) {
    throw new Error('Fee must have gas limit');
  }

  const gas = parseInt(fee.gas, 10);
  if (isNaN(gas) || gas <= 0) {
    throw new Error('Fee gas must be a positive number');
  }

  return true;
}

/**
 * Validate message structure.
 * Ensures message has required EncodeObject properties.
 *
 * @param {any} message - Message to validate
 * @returns {message is EncodeObject} Type guard result
 */
export function isValidMessage(message: any): message is EncodeObject {
  return (
    typeof message === 'object' &&
    message !== null &&
    typeof message.typeUrl === 'string' &&
    message.typeUrl.startsWith('/') &&
    'value' in message &&
    typeof message.value === 'object'
  );
}

/**
 * Validate array of messages.
 *
 * @param {readonly any[]} messages - Messages to validate
 * @returns {messages is readonly EncodeObject[]} Type guard result
 * @throws {Error} If any message is invalid
 */
export function validateMessages(messages: readonly any[]): messages is readonly EncodeObject[] {
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  if (messages.length === 0) {
    throw new Error('Messages array cannot be empty');
  }

  messages.forEach((msg, idx) => {
    if (!isValidMessage(msg)) {
      throw new Error(
        `Message[${idx}] is invalid. Must have typeUrl (string starting with /) and value (object)`
      );
    }
  });

  return true;
}
