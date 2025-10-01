#!/usr/bin/env tsx
/**
 * Parse evmd-comprehensive-data.md into TypeScript schemas
 *
 * This script extracts:
 * - Module parameters with types, defaults, and validation
 * - CLI commands with args and flags
 * - Governance proposal templates
 * - Precompile addresses and configs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ParamSchema {
  key: string;
  type: string;
  default: any;
  validation: string;
  description: string;
  governanceOnly: boolean;
}

interface ModuleSchema {
  name: string;
  params: ParamSchema[];
  queries: CommandSchema[];
  txs: CommandSchema[];
}

interface CommandSchema {
  path: string[];
  usage: string;
  args: ArgSchema[];
  flags: FlagSchema[];
  examples: string[];
  description: string;
}

interface ArgSchema {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface FlagSchema {
  name: string;
  type: string;
  default?: any;
  required: boolean;
  description: string;
}

const markdown = readFileSync(
  join(__dirname, '../src/lib/chains/evmd/evmd-comprehensive-data.md'),
  'utf-8'
);

// Parse VM Module Parameters
const vmParamsSection = markdown.match(/### VM \(EVM\) Module Parameters[\s\S]*?(?=###|---)/)?.[0] || '';
const vmParamsTable = vmParamsSection.match(/\|[\s\S]*?\n\n/)?.[0] || '';

const vmParams: ParamSchema[] = [];
const vmParamRows = vmParamsTable.split('\n').slice(2); // Skip header and separator

vmParamRows.forEach(row => {
  if (!row.trim() || !row.includes('|')) return;

  const cols = row.split('|').map(c => c.trim()).filter(Boolean);
  if (cols.length < 5) return;

  const [param, type, defaultVal, description, constraints] = cols;

  vmParams.push({
    key: param.replace(/`/g, ''),
    type: type.toLowerCase(),
    default: parseDefaultValue(defaultVal, type),
    validation: constraints || '',
    description: description,
    governanceOnly: true
  });
});

// Parse ERC20 Module Parameters
const erc20ParamsSection = markdown.match(/### ERC20 Module Parameters[\s\S]*?(?=###|---)/)?.[0] || '';
const erc20ParamsTable = erc20ParamsSection.match(/\|[\s\S]*?\n\n/)?.[0] || '';

const erc20Params: ParamSchema[] = [];
const erc20ParamRows = erc20ParamsTable.split('\n').slice(2);

erc20ParamRows.forEach(row => {
  if (!row.trim() || !row.includes('|')) return;

  const cols = row.split('|').map(c => c.trim()).filter(Boolean);
  if (cols.length < 4) return;

  const [param, type, defaultVal, description] = cols;

  erc20Params.push({
    key: param.replace(/`/g, ''),
    type: type.toLowerCase(),
    default: parseDefaultValue(defaultVal, type),
    validation: '',
    description: description,
    governanceOnly: true
  });
});

// Parse Fee Market Module Parameters
const feemarketParamsSection = markdown.match(/### Fee Market Module Parameters[\s\S]*?(?=###|---)/)?.[0] || '';
const feemarketParamsTable = feemarketParamsSection.match(/\|[\s\S]*?\n\n/)?.[0] || '';

const feemarketParams: ParamSchema[] = [];
const feemarketParamRows = feemarketParamsTable.split('\n').slice(2);

feemarketParamRows.forEach(row => {
  if (!row.trim() || !row.includes('|')) return;

  const cols = row.split('|').map(c => c.trim()).filter(Boolean);
  if (cols.length < 5) return;

  const [param, type, defaultVal, description, constraints] = cols;

  feemarketParams.push({
    key: param.replace(/`/g, ''),
    type: type.toLowerCase(),
    default: parseDefaultValue(defaultVal, type),
    validation: constraints || '',
    description: description,
    governanceOnly: true
  });
});

function parseDefaultValue(val: string, type: string): any {
  val = val.replace(/`/g, '').trim();

  if (val === '[]' || val === 'empty array') return [];
  if (val === '{}') return {};
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (type.includes('number') || type.includes('int') || type.includes('Dec')) {
    const num = parseFloat(val);
    return isNaN(num) ? val : num;
  }

  return val;
}

// Generate TypeScript schemas
const output = `// Auto-generated from evmd-comprehensive-data.md
// DO NOT EDIT MANUALLY

import { z } from 'zod';

// ============================================================================
// VM Module Parameters
// ============================================================================

export const evmdVmParams = {
${vmParams.map(p => `  ${p.key}: {
    type: '${p.type}' as const,
    default: ${JSON.stringify(p.default)},
    validation: z.${getZodType(p.type, p.validation)},
    description: '${p.description}',
    governanceOnly: ${p.governanceOnly}
  }`).join(',\n')}
} as const;

// ============================================================================
// ERC20 Module Parameters
// ============================================================================

export const evmdErc20Params = {
${erc20Params.map(p => `  ${p.key}: {
    type: '${p.type}' as const,
    default: ${JSON.stringify(p.default)},
    validation: z.${getZodType(p.type, p.validation)},
    description: '${p.description}',
    governanceOnly: ${p.governanceOnly}
  }`).join(',\n')}
} as const;

// ============================================================================
// Fee Market Module Parameters
// ============================================================================

export const evmdFeemarketParams = {
${feemarketParams.map(p => `  ${p.key}: {
    type: '${p.type}' as const,
    default: ${JSON.stringify(p.default)},
    validation: z.${getZodType(p.type, p.validation)},
    description: '${p.description}',
    governanceOnly: ${p.governanceOnly}
  }`).join(',\n')}
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
`;

function getZodType(type: string, validation: string): string {
  type = type.toLowerCase();

  if (type.includes('bool')) return 'boolean()';
  if (type.includes('int') || type.includes('number') || type.includes('uint')) return 'number()';
  if (type.includes('array') || type.includes('[]')) return 'array(z.any())';
  if (type.includes('object')) return 'object({})';

  return 'string()';
}

// Write output
writeFileSync(
  join(__dirname, '../src/lib/chains/evmd/params.ts'),
  output,
  'utf-8'
);

console.log('✅ Generated params.ts from evmd-comprehensive-data.md');
console.log(`   - VM params: ${vmParams.length}`);
console.log(`   - ERC20 params: ${erc20Params.length}`);
console.log(`   - Feemarket params: ${feemarketParams.length}`);
