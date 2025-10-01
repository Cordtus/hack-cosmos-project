// Auto-generated from evmd-comprehensive-data.md
// DO NOT EDIT MANUALLY

import { z } from 'zod';

// ============================================================================
// VM Module Parameters
// ============================================================================

export const evmdVmParams = {
  evm_denom: {
    type: 'string' as const,
    default: 'atest',
    validation: z.string().min(1),
    description: 'Token denomination used to run the EVM state transitions',
    governanceOnly: true
  },
  allow_unprotected_txs: {
    type: 'boolean' as const,
    default: false,
    validation: z.boolean(),
    description: 'Allow replay-protected (i.e non EIP155 signed) transactions',
    governanceOnly: true
  },
  extra_eips: {
    type: 'array' as const,
    default: [] as number[],
    validation: z.array(z.number()),
    description: 'Additional EIPs for the vm.Config (must be valid activatable EIPs, no duplicates)',
    governanceOnly: true
  },
  active_static_precompiles: {
    type: 'array' as const,
    default: [] as string[],
    validation: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/)),
    description: 'Hex addresses of active precompiled contracts (must be valid, sorted, no duplicates)',
    governanceOnly: true
  },
  evm_channels: {
    type: 'array' as const,
    default: [] as string[],
    validation: z.array(z.string()),
    description: 'IBC channel identifiers from EVM compatible chains',
    governanceOnly: true
  },
  access_control: {
    type: 'object' as const,
    default: {
      create: {
        access_type: 'ACCESS_TYPE_PERMISSIONLESS' as const,
        access_control_list: [] as string[]
      },
      call: {
        access_type: 'ACCESS_TYPE_PERMISSIONLESS' as const,
        access_control_list: [] as string[]
      }
    },
    validation: z.object({
      create: z.object({
        access_type: z.enum(['ACCESS_TYPE_PERMISSIONLESS', 'ACCESS_TYPE_RESTRICTED', 'ACCESS_TYPE_PERMISSIONED']),
        access_control_list: z.array(z.string())
      }),
      call: z.object({
        access_type: z.enum(['ACCESS_TYPE_PERMISSIONLESS', 'ACCESS_TYPE_RESTRICTED', 'ACCESS_TYPE_PERMISSIONED']),
        access_control_list: z.array(z.string())
      })
    }),
    description: 'Permission policy for EVM contract creation and calls',
    governanceOnly: true
  }
} as const;

// ============================================================================
// ERC20 Module Parameters
// ============================================================================

export const evmdErc20Params = {
  enable_erc20: {
    type: 'boolean' as const,
    default: true,
    validation: z.boolean(),
    description: 'Enable ERC20 module functionality',
    governanceOnly: true
  },
  permissionless_registration: {
    type: 'boolean' as const,
    default: true,
    validation: z.boolean(),
    description: 'Allow permissionless ERC20 token registration',
    governanceOnly: true
  }
} as const;

// ============================================================================
// Fee Market Module Parameters
// ============================================================================

export const evmdFeemarketParams = {
  no_base_fee: {
    type: 'boolean' as const,
    default: false,
    validation: z.boolean(),
    description: 'Disable base fee mechanism',
    governanceOnly: true
  },
  base_fee_change_denominator: {
    type: 'number' as const,
    default: 8,
    validation: z.number().min(1),
    description: 'Base fee adjustment denominator (cannot be 0)',
    governanceOnly: true
  },
  elasticity_multiplier: {
    type: 'number' as const,
    default: 2,
    validation: z.number().min(1),
    description: 'Block gas limit elasticity multiplier (cannot be 0)',
    governanceOnly: true
  },
  base_fee: {
    type: 'string' as const,
    default: '1000000000',
    validation: z.string(),
    description: 'Initial base fee (1 gwei, cannot be negative)',
    governanceOnly: true
  },
  enable_height: {
    type: 'number' as const,
    default: 0,
    validation: z.number().min(0),
    description: 'Height to enable fee market (cannot be negative)',
    governanceOnly: true
  },
  min_gas_price: {
    type: 'string' as const,
    default: '0',
    validation: z.string(),
    description: 'Minimum gas price (cannot be negative)',
    governanceOnly: true
  },
  min_gas_multiplier: {
    type: 'string' as const,
    default: '0.5',
    validation: z.string().refine((val) => {
      const num = parseFloat(val);
      return num >= 0 && num <= 1;
    }),
    description: 'Minimum gas multiplier (0 ≤ value ≤ 1)',
    governanceOnly: true
  }
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type VmParams = {
  [K in keyof typeof evmdVmParams]: typeof evmdVmParams[K]['default'];
};

export type Erc20Params = {
  [K in keyof typeof evmdErc20Params]: typeof evmdErc20Params[K]['default'];
};

export type FeemarketParams = {
  [K in keyof typeof evmdFeemarketParams]: typeof evmdFeemarketParams[K]['default'];
};

// ============================================================================
// Governance Message Types
// ============================================================================

export const GOVERNANCE_AUTHORITY = 'cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn';

export const MSG_TYPES = {
  VM_UPDATE_PARAMS: '/cosmos.evm.vm.v1.MsgUpdateParams',
  VM_REGISTER_PREINSTALLS: '/cosmos.evm.vm.v1.MsgRegisterPreinstalls',
  ERC20_UPDATE_PARAMS: '/cosmos.evm.erc20.v1.MsgUpdateParams',
  ERC20_REGISTER: '/cosmos.evm.erc20.v1.MsgRegisterERC20',
  ERC20_TOGGLE_CONVERSION: '/cosmos.evm.erc20.v1.MsgToggleConversion',
  FEEMARKET_UPDATE_PARAMS: '/cosmos.evm.feemarket.v1.MsgUpdateParams'
} as const;
