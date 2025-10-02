// Governance proposal types and categories

export const PROPOSAL_CATEGORIES = {
  PARAMETER_CHANGE: 'parameter_change',
  TEXT: 'text',
  COMMUNITY_POOL_SPEND: 'community_pool_spend',
  SOFTWARE_UPGRADE: 'software_upgrade',
  CANCEL_UPGRADE: 'cancel_upgrade',
  IBC_CLIENT: 'ibc_client',
  EVM_GOVERNANCE: 'evm_governance',
  CUSTOM_MESSAGE: 'custom_message',
} as const;

export type ProposalCategory = typeof PROPOSAL_CATEGORIES[keyof typeof PROPOSAL_CATEGORIES];

export interface ProposalType {
  id: string;
  category: ProposalCategory;
  name: string;
  description: string;
  icon?: string;
  requiresMessages: boolean;
  allowsExpedited: boolean;
}

export const PROPOSAL_TYPES: Record<string, ProposalType> = {
  // Main Proposal Types

  // Text Proposal
  TEXT: {
    id: 'text',
    category: PROPOSAL_CATEGORIES.TEXT,
    name: 'Text Proposal',
    description: 'Submit a text proposal for signaling, policy, or other non-binding governance decisions',
    requiresMessages: false,
    allowsExpedited: true,
  },

  // Community Pool Spend
  COMMUNITY_POOL_SPEND: {
    id: 'community_pool_spend',
    category: PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND,
    name: 'Community Pool Spend',
    description: 'Request funds from the community pool for ecosystem development, grants, or initiatives',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // Software Upgrade
  SOFTWARE_UPGRADE: {
    id: 'software_upgrade',
    category: PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE,
    name: 'Software Upgrade',
    description: 'Schedule a coordinated chain software upgrade at a specific block height',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // Cancel Upgrade
  CANCEL_UPGRADE: {
    id: 'cancel_upgrade',
    category: PROPOSAL_CATEGORIES.CANCEL_UPGRADE,
    name: 'Cancel Software Upgrade',
    description: 'Cancel a previously scheduled software upgrade',
    requiresMessages: true,
    allowsExpedited: true,
  },

  // Parameter Change (single entry point for all parameter changes)
  PARAMETER_CHANGE: {
    id: 'parameter_change',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Parameter Change',
    description: 'Modify on-chain parameters for any module including governance, staking, distribution, or custom modules',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // IBC Client Updates
  IBC_CLIENT_UPDATE: {
    id: 'ibc_client_update',
    category: PROPOSAL_CATEGORIES.IBC_CLIENT,
    name: 'IBC Client Update',
    description: 'Update IBC client parameters or recover expired IBC clients',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // EVM-specific proposals grouped under one entry
  EVM_GOVERNANCE: {
    id: 'evm_governance',
    category: PROPOSAL_CATEGORIES.EVM_GOVERNANCE,
    name: 'EVM Governance Action',
    description: 'Manage EVM-specific operations like registering contracts, ERC20 tokens, or toggling conversions',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // Custom Message for advanced users
  CUSTOM_MESSAGE: {
    id: 'custom_message',
    category: PROPOSAL_CATEGORIES.CUSTOM_MESSAGE,
    name: 'Custom Message',
    description: 'Submit a proposal with custom message types (advanced users only)',
    requiresMessages: true,
    allowsExpedited: false,
  },
} as const;

export interface ProposalMetadata {
  title: string;
  summary: string;
  deposit: { amount: string; denom: string };
  expedited: boolean;
  autoVote: boolean;
}

export interface BaseProposal {
  metadata: ProposalMetadata;
  proposalType: ProposalType;
}

// Parameter Change specific types
export interface ParameterSelection {
  module: 'vm' | 'erc20' | 'feemarket';
  parameter: string;
  value: any;
  description?: string;
}

export interface ParameterChangeProposal extends BaseProposal {
  parameters: ParameterSelection[];
}

// Text Proposal
export interface TextProposal extends BaseProposal {
  // Only metadata required
}

// Community Pool Spend
export interface CommunityPoolSpendProposal extends BaseProposal {
  recipient: string;
  amount: Array<{ amount: string; denom: string }>;
}

// Software Upgrade
export interface SoftwareUpgradeProposal extends BaseProposal {
  name: string;
  height: string;
  info: string;
}

// Cancel Upgrade
export interface CancelUpgradeProposal extends BaseProposal {
  // Only metadata required
}

// IBC Client Parameters
export interface IbcClientParamsProposal extends BaseProposal {
  allowedClients: string[];
}

// EVM Register Preinstalls
export interface EvmRegisterPreinstallsProposal extends BaseProposal {
  preinstalls: Array<{
    name: string;
    address: string;
    code: string;
  }>;
}

// EVM Register ERC20
export interface EvmRegisterErc20Proposal extends BaseProposal {
  erc20Addresses: string[];
}

// EVM Toggle Conversion
export interface EvmToggleConversionProposal extends BaseProposal {
  token: string;
}

// Custom Message
export interface CustomMessageProposal extends BaseProposal {
  messages: Array<{
    typeUrl: string;
    value: any;
  }>;
}
