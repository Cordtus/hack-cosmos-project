/**
 * @fileoverview Formatting utilities
 * Functions for formatting blockchain data types including token amounts, dates, percentages,
 * and various numeric displays. Uses BigInt for precise token amount handling.
 */

import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format token amount from base denomination to human-readable decimal.
 * Handles large numbers using BigInt to avoid precision loss.
 *
 * @param {string | number} amount - Token amount in base denomination (e.g., "1000000")
 * @param {number} [decimals=6] - Number of decimal places (e.g., 6 for uatom)
 * @returns {string} Human-readable amount with full precision
 * @example
 * formatAmount('1000000', 6); // Returns: '1.000000'
 * formatAmount('1500000', 6); // Returns: '1.500000'
 * formatAmount('1000000000000000000', 18); // Returns: '1.000000000000000000'
 */
export function formatAmount(amount: string | number, decimals: number = 6): string {
  const num = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const whole = num / divisor;
  const fraction = num % divisor;

  const fractionStr = fraction.toString().padStart(decimals, '0');
  return `${whole}.${fractionStr}`;
}

/**
 * Parse human-readable decimal amount to base denomination.
 * Converts decimal representation back to integer string for transactions.
 *
 * @param {string} amount - Human-readable amount (e.g., "1.5")
 * @param {number} [decimals=6] - Number of decimal places to use
 * @returns {string} Amount in base denomination as string
 * @example
 * parseAmount('1.5', 6); // Returns: '1500000'
 * parseAmount('0.000001', 6); // Returns: '1'
 * parseAmount('1', 18); // Returns: '1000000000000000000'
 */
export function parseAmount(amount: string, decimals: number = 6): string {
  const [whole = '0', fraction = '0'] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction)).toString();
}

/**
 * Format Cosmos SDK coin object for user display.
 * Automatically converts micro/atto denominations to display denomination.
 *
 * @param {{ amount: string; denom: string }} coin - Coin object with amount and denomination
 * @param {number} [decimals=6] - Number of decimal places for formatting
 * @returns {string} Formatted coin string (e.g., "1.000000 ATOM")
 * @example
 * formatCoin({ amount: '1000000', denom: 'uatom' }, 6); // Returns: '1.000000 ATOM'
 * formatCoin({ amount: '1000000000000000000', denom: 'aevmos' }, 18); // Returns: '1.000000000000000000 EVMOS'
 */
export function formatCoin(coin: { amount: string; denom: string }, decimals: number = 6): string {
  const amount = formatAmount(coin.amount, decimals);
  const displayDenom = coin.denom.startsWith('u')
    ? coin.denom.slice(1).toUpperCase()
    : coin.denom.startsWith('a')
    ? coin.denom.slice(1).toUpperCase()
    : coin.denom.toUpperCase();

  return `${amount} ${displayDenom}`;
}

/**
 * Format decimal percentage to human-readable percentage string.
 * Converts decimal (0-1) to percentage (0-100%).
 *
 * @param {number} value - Decimal value (0-1 range)
 * @param {number} [decimals=2] - Number of decimal places in output
 * @returns {string} Formatted percentage string
 * @example
 * formatPercent(0.15); // Returns: '15.00%'
 * formatPercent(0.025, 3); // Returns: '2.500%'
 * formatPercent(1); // Returns: '100.00%'
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format date to human-readable string using date-fns patterns.
 *
 * @param {string | Date} date - Date to format (ISO string or Date object)
 * @param {string} [pattern='PPpp'] - date-fns format pattern (default: 'Jan 1, 2024 12:00 AM')
 * @returns {string} Formatted date string
 * @example
 * formatDate('2024-01-01T00:00:00Z'); // Returns: 'Jan 1, 2024 12:00 AM'
 * formatDate(new Date(), 'yyyy-MM-dd'); // Returns: '2024-01-01'
 */
export function formatDate(date: string | Date, pattern: string = 'PPpp'): string {
  return format(new Date(date), pattern);
}

/**
 * Format date as relative time from now.
 * Displays time difference in human-readable format (e.g., "2 hours ago").
 *
 * @param {string | Date} date - Date to compare to now
 * @returns {string} Relative time string with "ago" suffix
 * @example
 * formatRelativeTime('2024-01-01T00:00:00Z'); // Returns: '2 hours ago'
 * formatRelativeTime(new Date(Date.now() - 60000)); // Returns: '1 minute ago'
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format large numbers with SI abbreviations (K, M, B).
 * Useful for displaying large token amounts or counts.
 *
 * @param {number} num - Number to format
 * @returns {string} Abbreviated number string
 * @example
 * formatNumber(1500000); // Returns: '1.50M'
 * formatNumber(2500); // Returns: '2.50K'
 * formatNumber(3000000000); // Returns: '3.00B'
 * formatNumber(500); // Returns: '500'
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toString();
}

/**
 * Format gas amount with thousand separators.
 * Makes gas amounts more readable in transaction displays.
 *
 * @param {number | string} gas - Gas amount
 * @returns {string} Formatted gas with commas
 * @example
 * formatGas(200000); // Returns: '200,000'
 * formatGas('500000'); // Returns: '500,000'
 */
export function formatGas(gas: number | string): string {
  return Number(gas).toLocaleString();
}

/**
 * Format validator commission rate from decimal string to percentage.
 * Handles Cosmos SDK decimal strings (18 decimal places).
 *
 * @param {string} rate - Commission rate as decimal string
 * @returns {string} Formatted percentage
 * @example
 * formatCommission('0.050000000000000000'); // Returns: '5.00%'
 * formatCommission('0.100000000000000000'); // Returns: '10.00%'
 */
export function formatCommission(rate: string): string {
  return formatPercent(parseFloat(rate));
}
