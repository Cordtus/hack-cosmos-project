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
  // Parameter Change Proposals
  PARAM_CHANGE_VM: {
    id: 'param_change_vm',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'VM Module Parameters',
    description: 'Update EVM virtual machine configuration including denomination, EIPs, precompiles, and access control',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_ERC20: {
    id: 'param_change_erc20',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'ERC20 Module Parameters',
    description: 'Configure ERC20 module settings including enable/disable and registration permissions',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_FEEMARKET: {
    id: 'param_change_feemarket',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Fee Market Parameters',
    description: 'Adjust fee market dynamics including base fee, elasticity, and minimum gas settings',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_MULTI: {
    id: 'param_change_multi',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Multi-Module Parameters',
    description: 'Update parameters across multiple modules in a single proposal',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_GOV: {
    id: 'param_change_gov',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Governance Module Parameters',
    description: 'Update governance parameters including voting periods, quorum, thresholds, and deposit requirements',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_BANK: {
    id: 'param_change_bank',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Bank Module Parameters',
    description: 'Configure bank module settings including send enabled and default send enabled',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_STAKING: {
    id: 'param_change_staking',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Staking Module Parameters',
    description: 'Update staking parameters including unbonding time, max validators, and bond denomination',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_DISTRIBUTION: {
    id: 'param_change_distribution',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Distribution Module Parameters',
    description: 'Adjust distribution parameters including community tax and base proposer reward',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_SLASHING: {
    id: 'param_change_slashing',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Slashing Module Parameters',
    description: 'Configure slashing penalties including downtime jail duration and slash fractions',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_MINT: {
    id: 'param_change_mint',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Mint Module Parameters',
    description: 'Update minting parameters including inflation rate and goal bonded ratio',
    requiresMessages: true,
    allowsExpedited: false,
  },
  PARAM_CHANGE_CONSENSUS: {
    id: 'param_change_consensus',
    category: PROPOSAL_CATEGORIES.PARAMETER_CHANGE,
    name: 'Consensus Parameters',
    description: 'Modify consensus parameters including block size, gas limits, and validator set size',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // Text Proposals
  TEXT_SIGNALING: {
    id: 'text_signaling',
    category: PROPOSAL_CATEGORIES.TEXT,
    name: 'Signaling Proposal',
    description: 'Non-binding governance vote to gauge community sentiment on a topic',
    requiresMessages: false,
    allowsExpedited: true,
  },

  // Community Pool Spend
  COMMUNITY_SPEND: {
    id: 'community_spend',
    category: PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND,
    name: 'Community Pool Spend',
    description: 'Propose spending from the community pool for ecosystem development or initiatives',
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
  CANCEL_UPGRADE: {
    id: 'cancel_upgrade',
    category: PROPOSAL_CATEGORIES.CANCEL_UPGRADE,
    name: 'Cancel Software Upgrade',
    description: 'Cancel a previously scheduled software upgrade',
    requiresMessages: true,
    allowsExpedited: true,
  },

  // IBC Client Parameters
  IBC_CLIENT_PARAMS: {
    id: 'ibc_client_params',
    category: PROPOSAL_CATEGORIES.IBC_CLIENT,
    name: 'IBC Client Parameters',
    description: 'Update IBC client module parameters including allowed client types',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // EVM Governance Operations
  EVM_REGISTER_PREINSTALLS: {
    id: 'evm_register_preinstalls',
    category: PROPOSAL_CATEGORIES.EVM_GOVERNANCE,
    name: 'Register Preinstalled Contracts',
    description: 'Register preinstalled smart contracts in the EVM state (governance authority required)',
    requiresMessages: true,
    allowsExpedited: false,
  },
  EVM_REGISTER_ERC20: {
    id: 'evm_register_erc20',
    category: PROPOSAL_CATEGORIES.EVM_GOVERNANCE,
    name: 'Register ERC20 Tokens',
    description: 'Register ERC20 token contracts for Cosmos Coin conversion (when permissionless registration is disabled)',
    requiresMessages: true,
    allowsExpedited: false,
  },
  EVM_TOGGLE_CONVERSION: {
    id: 'evm_toggle_conversion',
    category: PROPOSAL_CATEGORIES.EVM_GOVERNANCE,
    name: 'Toggle Token Conversion',
    description: 'Enable or disable conversion for specific ERC20/Cosmos Coin token pairs',
    requiresMessages: true,
    allowsExpedited: false,
  },

  // Custom Message
  CUSTOM_MESSAGE: {
    id: 'custom_message',
    category: PROPOSAL_CATEGORIES.CUSTOM_MESSAGE,
    name: 'Custom Message',
    description: 'Submit a governance proposal with custom message types (advanced users only)',
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
