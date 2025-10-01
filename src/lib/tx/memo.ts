/**
 * @fileoverview Memo formatting utilities
 * Utilities for creating, validating, and formatting transaction memos.
 */

/** Maximum memo length allowed by Cosmos SDK */
const MAX_MEMO_LENGTH = 256;

/** Application identifier for memos */
const APP_IDENTIFIER = 'Chain Orchestrator';

/**
 * Validate and sanitize transaction memo.
 * Removes non-printable characters and truncates if too long.
 *
 * @param {string} memo - Raw memo text
 * @returns {string} Cleaned and validated memo
 * @example
 * formatMemo('Hello\x00World'); // Returns: 'HelloWorld'
 * formatMemo('A'.repeat(300)); // Returns: 'AAA...' (truncated to 256)
 */
export function formatMemo(memo: string): string {
  if (!memo) return '';

  // Remove non-printable characters (keep only ASCII 32-126)
  const cleaned = memo.replace(/[^\x20-\x7E]/g, '');

  // Truncate if too long, with ellipsis
  if (cleaned.length > MAX_MEMO_LENGTH) {
    return cleaned.slice(0, MAX_MEMO_LENGTH - 3) + '...';
  }

  return cleaned;
}

/**
 * Create a memo with application identifier.
 * Prepends the app name and action to the memo.
 *
 * @param {string} action - Action being performed (e.g., "Submit Proposal", "Vote")
 * @param {Record<string, any>} [metadata] - Optional metadata to include
 * @returns {string} Formatted memo with app identifier
 * @example
 * createAppMemo('Submit Proposal', { type: 'param_change' });
 * // Returns: 'Chain Orchestrator: Submit Proposal | {"type":"param_change"}'
 */
export function createAppMemo(action: string, metadata?: Record<string, any>): string {
  const base = `${APP_IDENTIFIER}: ${action}`;

  if (metadata) {
    try {
      const metaStr = JSON.stringify(metadata);
      const available = MAX_MEMO_LENGTH - base.length - 3; // Account for ' | '

      if (metaStr.length <= available) {
        return `${base} | ${metaStr}`;
      }

      // If metadata too long, truncate it
      const truncated = metaStr.slice(0, available - 3) + '...';
      return `${base} | ${truncated}`;
    } catch {
      // If metadata can't be stringified, just return base
      return base;
    }
  }

  return base;
}

/**
 * Create a memo for governance proposal submission.
 *
 * @param {string} proposalType - Type of proposal
 * @param {string} [proposalTitle] - Optional proposal title
 * @returns {string} Formatted memo
 * @example
 * createProposalMemo('param_change', 'Update VM Parameters');
 * // Returns: 'Chain Orchestrator: Submit Proposal | param_change'
 */
export function createProposalMemo(proposalType: string, proposalTitle?: string): string {
  const metadata: Record<string, string> = {
    type: proposalType,
  };

  if (proposalTitle) {
    metadata.title = proposalTitle;
  }

  return createAppMemo('Submit Proposal', metadata);
}

/**
 * Create a memo for governance vote.
 *
 * @param {string} proposalId - Proposal ID being voted on
 * @param {string} option - Vote option (yes, no, abstain, veto)
 * @returns {string} Formatted memo
 * @example
 * createVoteMemo('42', 'yes');
 * // Returns: 'Chain Orchestrator: Vote | {"proposal":"42","vote":"yes"}'
 */
export function createVoteMemo(proposalId: string, option: string): string {
  return createAppMemo('Vote', {
    proposal: proposalId,
    vote: option,
  });
}

/**
 * Validate memo length.
 *
 * @param {string} memo - Memo to validate
 * @returns {boolean} True if valid length
 * @throws {Error} If memo exceeds maximum length
 */
export function validateMemoLength(memo: string): boolean {
  if (memo.length > MAX_MEMO_LENGTH) {
    throw new Error(`Memo exceeds maximum length of ${MAX_MEMO_LENGTH} characters`);
  }
  return true;
}

/**
 * Extract metadata from app-generated memo.
 * Attempts to parse JSON metadata from memo.
 *
 * @param {string} memo - Memo to parse
 * @returns {Record<string, any> | null} Parsed metadata or null if not app memo
 * @example
 * const memo = 'Chain Orchestrator: Vote | {"proposal":"42"}';
 * extractMetadata(memo); // Returns: { proposal: '42' }
 */
export function extractMetadata(memo: string): Record<string, any> | null {
  if (!memo.startsWith(APP_IDENTIFIER)) {
    return null;
  }

  const parts = memo.split(' | ');
  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(parts[1]);
  } catch {
    return null;
  }
}
