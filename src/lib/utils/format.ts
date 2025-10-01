import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format token amount from base denomination to human-readable
 * @example formatAmount('1000000', 6) => '1.000000'
 */
export function formatAmount(amount: string | number, decimals: number = 6): string {
  const num = typeof amount === 'string' ? BigInt(amount) : BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const whole = num / divisor;
  const fraction = num % divisor;

  const fractionStr = fraction.toString().padStart(decimals, '0');
  return `${whole}.${fractionStr}`;
}

/**
 * Parse human-readable amount to base denomination
 * @example parseAmount('1.5', 6) => '1500000'
 */
export function parseAmount(amount: string, decimals: number = 6): string {
  const [whole = '0', fraction = '0'] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction)).toString();
}

/**
 * Format coin object for display
 * @example formatCoin({ amount: '1000000', denom: 'uatom' }) => '1.000000 ATOM'
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
 * Format percentage
 * @example formatPercent(0.15) => '15.00%'
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format date to readable string
 * @example formatDate('2024-01-01T00:00:00Z') => 'Jan 1, 2024 12:00 AM'
 */
export function formatDate(date: string | Date, pattern: string = 'PPpp'): string {
  return format(new Date(date), pattern);
}

/**
 * Format relative time
 * @example formatRelativeTime('2024-01-01T00:00:00Z') => '2 hours ago'
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format large numbers with abbreviations
 * @example formatNumber(1500000) => '1.5M'
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toString();
}

/**
 * Format gas amount
 * @example formatGas(200000) => '200,000'
 */
export function formatGas(gas: number | string): string {
  return Number(gas).toLocaleString();
}

/**
 * Format validator commission rate
 * @example formatCommission('0.050000000000000000') => '5.00%'
 */
export function formatCommission(rate: string): string {
  return formatPercent(parseFloat(rate));
}
