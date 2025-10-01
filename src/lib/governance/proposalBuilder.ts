/**
 * @fileoverview Proposal message builder utilities
 * Constructs governance proposal messages from user inputs. These functions convert
 * user-friendly form data into properly formatted Cosmos SDK messages ready for submission.
 */

import { GOVERNANCE_AUTHORITY, MSG_TYPES } from '@/lib/chains/evmd/params';
import type { ParameterSelection } from './types';

/**
 * Represents a Cosmos SDK message in JSON format with @type field.
 * @interface ProposalMessage
 * @property {string} @type - The message type URL (e.g., /cosmos.gov.v1.MsgSubmitProposal)
 * @property {string} [authority] - The governance authority address (required for gov proposals)
 * @property {string} [signer] - The transaction signer address
 */
export interface ProposalMessage {
  '@type': string;
  authority?: string;
  signer?: string;
  [key: string]: any;
}

/**
 * Represents a complete built governance proposal ready for submission.
 * @interface BuiltProposal
 * @property {ProposalMessage[]} messages - Array of messages to execute if proposal passes
 * @property {string} metadata - Proposal metadata (typically empty string)
 * @property {Array<{amount: string, denom: string}>} deposit - Initial deposit coins
 * @property {string} title - Proposal title
 * @property {string} summary - Proposal summary (markdown supported)
 * @property {boolean} expedited - Whether this is an expedited proposal
 */
export interface BuiltProposal {
  messages: ProposalMessage[];
  metadata: string;
  deposit: Array<{ amount: string; denom: string }>;
  title: string;
  summary: string;
  expedited: boolean;
}

/**
 * Build parameter change messages from user selections.
 * Groups parameters by module and creates one MsgUpdateParams message per module.
 *
 * @param {ParameterSelection[]} parameterSelections - Array of parameter selections from the form
 * @returns {ProposalMessage[]} Array of MsgUpdateParams messages (one per module)
 * @example
 * const selections = [
 *   {module: 'vm', parameter: 'evm_denom', value: 'aevmos'},
 *   {module: 'vm', parameter: 'enable_create', value: true}
 * ];
 * const messages = buildParameterChangeMessages(selections);
 * // Returns: [{@type: '/evmos.evm.vm.v1.MsgUpdateParams', authority: '...', params: {...}}]
 */
export function buildParameterChangeMessages(parameterSelections: ParameterSelection[]): ProposalMessage[] {
  const messages: ProposalMessage[] = [];

  // Group parameters by module
  const paramsByModule = parameterSelections.reduce((acc, param) => {
    if (!acc[param.module]) {
      acc[param.module] = {};
    }
    acc[param.module][param.parameter] = param.value;
    return acc;
  }, {} as Record<string, any>);

  // Create a message for each module
  Object.entries(paramsByModule).forEach(([module, params]) => {
    const msgType =
      module === 'vm'
        ? MSG_TYPES.VM_UPDATE_PARAMS
        : module === 'erc20'
        ? MSG_TYPES.ERC20_UPDATE_PARAMS
        : MSG_TYPES.FEEMARKET_UPDATE_PARAMS;

    messages.push({
      '@type': msgType,
      authority: GOVERNANCE_AUTHORITY,
      params,
    });
  });

  return messages;
}

/**
 * Build community pool spend message.
 *
 * @param {string} recipient - Bech32 address to receive funds
 * @param {Array<{amount: string, denom: string}>} amount - Coin amounts to spend
 * @returns {ProposalMessage} MsgCommunityPoolSpend message
 */
export function buildCommunityPoolSpendMessage(recipient: string, amount: Array<{ amount: string; denom: string }>): ProposalMessage {
  return {
    '@type': '/cosmos.distribution.v1beta1.MsgCommunityPoolSpend',
    authority: GOVERNANCE_AUTHORITY,
    recipient,
    amount,
  };
}

/**
 * Build software upgrade message.
 * Creates a plan to halt the chain at a specific height for upgrade.
 *
 * @param {string} name - Upgrade name/version identifier
 * @param {string} height - Block height to execute upgrade
 * @param {string} info - JSON string with upgrade metadata (binaries, checksums, etc.)
 * @returns {ProposalMessage} MsgSoftwareUpgrade message
 */
export function buildSoftwareUpgradeMessage(name: string, height: string, info: string): ProposalMessage {
  return {
    '@type': '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade',
    authority: GOVERNANCE_AUTHORITY,
    plan: {
      name,
      height,
      info,
    },
  };
}

/**
 * Build cancel upgrade message.
 * Cancels a previously scheduled software upgrade.
 *
 * @returns {ProposalMessage} MsgCancelUpgrade message
 */
export function buildCancelUpgradeMessage(): ProposalMessage {
  return {
    '@type': '/cosmos.upgrade.v1beta1.MsgCancelUpgrade',
    authority: GOVERNANCE_AUTHORITY,
  };
}

/**
 * Build IBC client params message.
 * Updates the list of allowed IBC client types for cross-chain communication.
 *
 * @param {string[]} allowedClients - Array of allowed client type strings (e.g., ['07-tendermint'])
 * @returns {ProposalMessage} MsgUpdateParams message for IBC client module
 */
export function buildIbcClientParamsMessage(allowedClients: string[]): ProposalMessage {
  return {
    '@type': '/ibc.core.client.v1.MsgUpdateParams',
    authority: GOVERNANCE_AUTHORITY,
    params: {
      allowed_clients: allowedClients,
    },
  };
}

/**
 * Build register preinstalls message.
 * Registers preinstalled smart contracts in the EVM state.
 *
 * @param {Array<{name: string, address: string, code: string}>} preinstalls - Array of contract definitions
 * @returns {ProposalMessage} MsgRegisterPreinstalls message
 */
export function buildRegisterPreinstallsMessage(preinstalls: Array<{ name: string; address: string; code: string }>): ProposalMessage {
  return {
    '@type': '/cosmos.evm.vm.v1.MsgRegisterPreinstalls',
    authority: GOVERNANCE_AUTHORITY,
    preinstalls,
  };
}

/**
 * Build register ERC20 message.
 * Registers ERC20 token contracts for Cosmos Coin conversion.
 *
 * @param {string[]} erc20Addresses - Array of ERC20 contract addresses (0x-prefixed)
 * @returns {ProposalMessage} MsgRegisterERC20 message
 */
export function buildRegisterErc20Message(erc20Addresses: string[]): ProposalMessage {
  return {
    '@type': '/cosmos.evm.erc20.v1.MsgRegisterERC20',
    signer: GOVERNANCE_AUTHORITY,
    erc20addresses: erc20Addresses,
  };
}

/**
 * Build toggle conversion message.
 * Enables or disables conversion for a specific token pair.
 *
 * @param {string} token - Token identifier (ERC20 address or Cosmos denom)
 * @returns {ProposalMessage} MsgToggleConversion message
 */
export function buildToggleConversionMessage(token: string): ProposalMessage {
  return {
    '@type': '/cosmos.evm.erc20.v1.MsgToggleConversion',
    authority: GOVERNANCE_AUTHORITY,
    token,
  };
}

/**
 * Build standard Cosmos SDK module parameter update messages.
 * Generic function for updating parameters of standard Cosmos SDK modules.
 *
 * @param {string} module - Module name (gov, bank, staking, distribution, slashing, mint, consensus)
 * @param {any} params - Parameter object specific to the module
 * @returns {ProposalMessage} MsgUpdateParams message for the specified module
 */
export function buildStandardModuleParamsMessage(module: string, params: any): ProposalMessage {
  const moduleTypeMap: Record<string, string> = {
    gov: '/cosmos.gov.v1.MsgUpdateParams',
    bank: '/cosmos.bank.v1beta1.MsgUpdateParams',
    staking: '/cosmos.staking.v1beta1.MsgUpdateParams',
    distribution: '/cosmos.distribution.v1beta1.MsgUpdateParams',
    slashing: '/cosmos.slashing.v1beta1.MsgUpdateParams',
    mint: '/cosmos.mint.v1beta1.MsgUpdateParams',
    consensus: '/cosmos.consensus.v1.MsgUpdateParams',
  };

  return {
    '@type': moduleTypeMap[module],
    authority: GOVERNANCE_AUTHORITY,
    params,
  };
}

/**
 * Build complete proposal from messages.
 * Assembles all components into a complete governance proposal ready for submission.
 *
 * @param {ProposalMessage[]} messages - Array of messages to execute if proposal passes
 * @param {string} title - Proposal title
 * @param {string} summary - Proposal summary (markdown supported)
 * @param {{amount: string, denom: string}} deposit - Initial deposit
 * @param {boolean} [expedited=false] - Whether this is an expedited proposal
 * @returns {BuiltProposal} Complete built proposal object
 */
export function buildProposal(
  messages: ProposalMessage[],
  title: string,
  summary: string,
  deposit: { amount: string; denom: string },
  expedited: boolean = false
): BuiltProposal {
  return {
    messages,
    metadata: '', // Metadata is typically empty or contains IPFS hash
    deposit: [deposit],
    title,
    summary,
    expedited,
  };
}

/**
 * Generate CLI command for proposal submission.
 * Creates a shell command string for submitting the proposal via CLI.
 *
 * @param {BuiltProposal} proposal - The built proposal object
 * @param {string} chainId - The chain ID
 * @returns {string} CLI command string (requires proposal.json file and manual field completion)
 */
export function generateCliCommand(proposal: BuiltProposal, chainId: string): string {
  return `evmd tx gov submit-proposal proposal.json \\
  --from=<your-key> \\
  --chain-id=${chainId} \\
  --gas=auto \\
  --gas-adjustment=1.5 \\
  --fees=<fee>`;
}

/**
 * Export proposal JSON for download.
 * Converts the built proposal to a formatted JSON string.
 *
 * @param {BuiltProposal} proposal - The built proposal object
 * @returns {string} Pretty-printed JSON string
 */
export function exportProposalJson(proposal: BuiltProposal): string {
  return JSON.stringify(proposal, null, 2);
}
