// Governance proposal types and categories

export const PROPOSAL_CATEGORIES = {
  PARAMETER_CHANGE: 'parameter_change',
  TEXT: 'text',
  COMMUNITY_POOL_SPEND: 'community_pool_spend',
  SOFTWARE_UPGRADE: 'software_upgrade',
  CANCEL_UPGRADE: 'cancel_upgrade',
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
} as const;

export interface ProposalMetadata {
  title: string;
  summary: string;
  deposit: { amount: string; denom: string };
  expedited: boolean;
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
