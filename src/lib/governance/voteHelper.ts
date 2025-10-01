/**
 * @fileoverview Helper functions for voting on governance proposals
 * Provides utilities to create vote messages, extract proposal IDs from transaction responses,
 * and format vote options for display.
 */

/**
 * Vote options for governance proposals as defined by the Cosmos SDK gov module.
 * These correspond to the cosmos.gov.v1.VoteOption enum.
 *
 * @constant
 * @readonly
 * @property {number} VOTE_OPTION_UNSPECIFIED - No vote specified (invalid)
 * @property {number} VOTE_OPTION_YES - Vote in favor of the proposal
 * @property {number} VOTE_OPTION_ABSTAIN - Abstain from voting (counts toward quorum but not threshold)
 * @property {number} VOTE_OPTION_NO - Vote against the proposal
 * @property {number} VOTE_OPTION_NO_WITH_VETO - Vote against with veto (burns deposit if threshold reached)
 */
export const VoteOption = {
  VOTE_OPTION_UNSPECIFIED: 0,
  VOTE_OPTION_YES: 1,
  VOTE_OPTION_ABSTAIN: 2,
  VOTE_OPTION_NO: 3,
  VOTE_OPTION_NO_WITH_VETO: 4,
} as const;

export type VoteOption = typeof VoteOption[keyof typeof VoteOption];

/**
 * Create a MsgVote message for governance voting.
 * This message type is used for simple (non-weighted) votes on governance proposals.
 *
 * @param {string} proposalId - The proposal ID to vote on (as string, not number)
 * @param {string} voter - The bech32 address of the voter
 * @param {VoteOption} [option=VoteOption.VOTE_OPTION_YES] - The vote option (defaults to YES)
 * @returns {Object} A MsgVote message object with typeUrl and value
 * @example
 * const voteMsg = createVoteMessage('1', 'cosmos1abc...', VoteOption.VOTE_OPTION_YES);
 */
export function createVoteMessage(proposalId: string, voter: string, option: VoteOption = VoteOption.VOTE_OPTION_YES) {
  return {
    typeUrl: '/cosmos.gov.v1.MsgVote',
    value: {
      proposalId,
      voter,
      option,
      metadata: '',
    },
  };
}

/**
 * Create a weighted vote message for split voting.
 * Allows a voter to distribute their voting power across multiple options.
 * The sum of all weights should equal 1.0.
 *
 * @param {string} proposalId - The proposal ID to vote on
 * @param {string} voter - The bech32 address of the voter
 * @param {Array<{option: VoteOption, weight: string}>} options - Array of vote options with weights (e.g., [{option: 1, weight: "0.7"}, {option: 2, weight: "0.3"}])
 * @returns {Object} A MsgVoteWeighted message object with typeUrl and value
 * @example
 * const weightedVote = createWeightedVoteMessage('1', 'cosmos1abc...', [
 *   {option: VoteOption.VOTE_OPTION_YES, weight: "0.7"},
 *   {option: VoteOption.VOTE_OPTION_ABSTAIN, weight: "0.3"}
 * ]);
 */
export function createWeightedVoteMessage(
  proposalId: string,
  voter: string,
  options: Array<{ option: VoteOption; weight: string }>
) {
  return {
    typeUrl: '/cosmos.gov.v1.MsgVoteWeighted',
    value: {
      proposalId,
      voter,
      options,
      metadata: '',
    },
  };
}

/**
 * Generate vote message for auto-voting after proposal submission.
 * Used to automatically cast a YES vote on a proposal immediately after it's submitted.
 * This is a convenience wrapper around createVoteMessage that always votes YES.
 *
 * @param {string} proposalId - The proposal ID (as string, extracted from tx response)
 * @param {string} voterAddress - The bech32 address of the voter
 * @returns {Object} A MsgVote message ready for signing and broadcasting
 * @example
 * const txResponse = await submitProposal(...);
 * const proposalId = extractProposalId(txResponse);
 * if (proposalId && autoVote) {
 *   const voteMsg = generateAutoVoteMessage(proposalId, userAddress);
 *   await signAndBroadcast([voteMsg]);
 * }
 */
export function generateAutoVoteMessage(proposalId: string, voterAddress: string) {
  return createVoteMessage(proposalId, voterAddress, VoteOption.VOTE_OPTION_YES);
}

/**
 * Extract proposal ID from submit proposal transaction response.
 * Parses the transaction events to find the proposal_id attribute emitted
 * by the Cosmos SDK gov module's submit_proposal event.
 *
 * @param {any} txResponse - The transaction response object from broadcasting a submit proposal tx
 * @returns {string | null} The proposal ID as a string, or null if not found
 * @example
 * const txResponse = await wallet.signAndBroadcast(chainId, [submitProposalMsg], fee);
 * const proposalId = extractProposalId(txResponse);
 * if (proposalId) {
 *   console.log(`Proposal ${proposalId} submitted successfully`);
 * }
 */
export function extractProposalId(txResponse: any): string | null {
  if (!txResponse?.events) return null;

  // Look for submit_proposal event
  const submitEvent = txResponse.events.find(
    (event: any) => event.type === 'submit_proposal'
  );

  if (!submitEvent) return null;

  // Find proposal_id attribute
  const proposalIdAttr = submitEvent.attributes?.find(
    (attr: any) => attr.key === 'proposal_id'
  );

  return proposalIdAttr?.value || null;
}

/**
 * Format a vote option enum value into a human-readable string.
 * Converts the numeric vote option values into display-friendly text.
 *
 * @param {VoteOption} option - The vote option enum value
 * @returns {string} The formatted vote option text
 * @example
 * formatVoteOption(VoteOption.VOTE_OPTION_YES) // Returns: "Yes"
 * formatVoteOption(VoteOption.VOTE_OPTION_NO_WITH_VETO) // Returns: "No With Veto"
 */
export function formatVoteOption(option: VoteOption): string {
  switch (option) {
    case VoteOption.VOTE_OPTION_YES:
      return 'Yes';
    case VoteOption.VOTE_OPTION_NO:
      return 'No';
    case VoteOption.VOTE_OPTION_ABSTAIN:
      return 'Abstain';
    case VoteOption.VOTE_OPTION_NO_WITH_VETO:
      return 'No With Veto';
    default:
      return 'Unspecified';
  }
}
