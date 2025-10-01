/**
 * @fileoverview Default proposal templates
 * Pre-configured templates for common governance proposals.
 */

import type { ProposalTemplate } from '@/store/template';

/**
 * Default templates for common governance proposals.
 * These are loaded when user has no saved templates.
 */
export const defaultTemplates: Omit<ProposalTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[] = [
  {
    name: 'Enable EVM Module',
    description: 'Enable the EVM module and set basic parameters for EVM compatibility',
    category: 'parameter_change',
    config: {
      proposalType: 'parameter_change',
      selections: [
        {
          module: 'vm',
          parameter: 'enable_call',
          value: true,
          description: 'Enable EVM contract calls',
        },
        {
          module: 'vm',
          parameter: 'enable_create',
          value: true,
          description: 'Enable EVM contract creation',
        },
      ],
    },
  },
  {
    name: 'Disable EVM Module',
    description: 'Temporarily disable EVM functionality for emergency maintenance',
    category: 'parameter_change',
    config: {
      proposalType: 'parameter_change',
      selections: [
        {
          module: 'vm',
          parameter: 'enable_call',
          value: false,
          description: 'Disable EVM contract calls',
        },
        {
          module: 'vm',
          parameter: 'enable_create',
          value: false,
          description: 'Disable EVM contract creation',
        },
      ],
    },
  },
  {
    name: 'Standard Gas Fee Configuration',
    description: 'Configure recommended gas fee parameters for network stability',
    category: 'parameter_change',
    config: {
      proposalType: 'parameter_change',
      selections: [
        {
          module: 'feemarket',
          parameter: 'no_base_fee',
          value: false,
          description: 'Enable base fee mechanism',
        },
        {
          module: 'feemarket',
          parameter: 'base_fee_change_denominator',
          value: '8',
          description: 'Base fee change rate (1/8 = 12.5% max change per block)',
        },
        {
          module: 'feemarket',
          parameter: 'elasticity_multiplier',
          value: '2',
          description: 'Gas limit elasticity (2x multiplier)',
        },
      ],
    },
  },
  {
    name: 'Reduce Block Gas Limit',
    description: 'Reduce maximum gas per block during high network congestion',
    category: 'parameter_change',
    config: {
      proposalType: 'parameter_change',
      selections: [
        {
          module: 'feemarket',
          parameter: 'enable_height',
          value: '0',
          description: 'Immediate activation (next block)',
        },
      ],
    },
  },
  {
    name: 'Community Pool Marketing Campaign',
    description: 'Fund marketing and outreach from community pool',
    category: 'community_spend',
    config: {
      proposalType: 'community_spend',
      recipient: '',
      amount: [
        {
          amount: '100000000000000000000', // 100 tokens with 18 decimals
          denom: 'aevmos',
        },
      ],
      title: 'Community Pool Spend: Marketing Campaign',
      summary: 'This proposal requests funds from the community pool for marketing initiatives.\n\n**Purpose:**\nMarketing and community outreach to increase adoption.\n\n**Expected Outcome:**\nIncreased user engagement and ecosystem growth.',
    },
  },
  {
    name: 'Developer Grants Program',
    description: 'Fund developer grants from community pool',
    category: 'community_spend',
    config: {
      proposalType: 'community_spend',
      recipient: '',
      amount: [
        {
          amount: '500000000000000000000', // 500 tokens with 18 decimals
          denom: 'aevmos',
        },
      ],
      title: 'Community Pool Spend: Developer Grants',
      summary: 'This proposal requests funds for a developer grants program.\n\n**Purpose:**\nSupport ecosystem development through developer grants.\n\n**Expected Outcome:**\nNew applications and tools built on the platform.',
    },
  },
  {
    name: 'Major Protocol Upgrade',
    description: 'Schedule a major protocol upgrade with new features',
    category: 'software_upgrade',
    config: {
      proposalType: 'software_upgrade',
      name: 'v2.0.0',
      height: '', // User must fill in
      info: JSON.stringify(
        {
          binaries: {
            'linux/amd64': 'https://github.com/example/releases/download/v2.0.0/chain-linux-amd64',
            'darwin/amd64': 'https://github.com/example/releases/download/v2.0.0/chain-darwin-amd64',
          },
        },
        null,
        2
      ),
      title: 'Software Upgrade: v2.0.0',
      summary: 'This proposal schedules a software upgrade for the chain.\n\n**Changes:**\n- New feature X\n- Performance improvements\n- Bug fixes\n\n**Preparation:**\nValidators should download binaries and prepare for upgrade.\n\n**Resources:**\n[Add documentation links]',
    },
  },
  {
    name: 'Security Patch Upgrade',
    description: 'Emergency upgrade for critical security patch',
    category: 'software_upgrade',
    config: {
      proposalType: 'software_upgrade',
      name: 'v1.0.1-security',
      height: '', // User must fill in
      info: JSON.stringify(
        {
          binaries: {
            'linux/amd64': 'https://github.com/example/releases/download/v1.0.1/chain-linux-amd64',
          },
        },
        null,
        2
      ),
      title: 'Security Upgrade: v1.0.1',
      summary: 'This proposal schedules an urgent security patch upgrade.\n\n**Changes:**\n- Critical security fix\n- No breaking changes\n\n**Preparation:**\nValidators must upgrade before block height.',
    },
  },
  {
    name: 'Enable IBC Transfer',
    description: 'Enable IBC transfer functionality',
    category: 'ibc_client',
    config: {
      proposalType: 'ibc_client',
      allowedClients: ['07-tendermint'],
      title: 'Update IBC Allowed Clients: Tendermint',
      summary: 'This proposal enables IBC transfer functionality.\n\n**Allowed Client Types:**\n- 07-tendermint\n\n**Rationale:**\nEnable cross-chain communication with other Cosmos chains.',
    },
  },
];

/**
 * Get default templates by category.
 * @param category - Template category to filter by
 * @returns Array of templates in the specified category
 */
export function getDefaultTemplatesByCategory(
  category: string
): typeof defaultTemplates {
  return defaultTemplates.filter((template) => template.category === category);
}

/**
 * Get a default template by name.
 * @param name - Template name
 * @returns Template if found, undefined otherwise
 */
export function getDefaultTemplateByName(
  name: string
): typeof defaultTemplates[0] | undefined {
  return defaultTemplates.find((template) => template.name === name);
}
