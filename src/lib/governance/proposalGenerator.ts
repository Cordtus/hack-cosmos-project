/**
 * @fileoverview Auto-generate proposal titles and summaries from parameter selections
 * Provides functions to create human-readable, descriptive titles and summaries for all
 * governance proposal types based on user-provided configuration data.
 */

import type { ParameterSelection, ProposalType } from './types';

/**
 * Generate a descriptive proposal title from parameter selections.
 * Creates context-aware titles based on the number of modules and parameters being updated.
 *
 * @param {ParameterSelection[]} selections - Array of parameter selections with module, parameter, and value
 * @returns {string} A formatted proposal title (e.g., "Update VM Evm Denom" or "Update 3 FEEMARKET Parameters")
 * @example
 * const selections = [{module: 'vm', parameter: 'evm_denom', value: 'aevmos'}];
 * generateParameterChangeTitle(selections); // Returns: "Update VM Evm Denom"
 */
export function generateParameterChangeTitle(selections: ParameterSelection[]): string {
  if (selections.length === 0) return '';

  // Group by module
  const byModule = selections.reduce((acc, sel) => {
    if (!acc[sel.module]) acc[sel.module] = [];
    acc[sel.module].push(sel);
    return acc;
  }, {} as Record<string, ParameterSelection[]>);

  const modules = Object.keys(byModule);

  // Single module, single parameter
  if (modules.length === 1 && selections.length === 1) {
    const param = selections[0];
    const moduleName = param.module.toUpperCase();
    const paramName = param.parameter.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `Update ${moduleName} ${paramName}`;
  }

  // Single module, multiple parameters
  if (modules.length === 1) {
    const moduleName = modules[0].toUpperCase();
    return `Update ${selections.length} ${moduleName} Parameters`;
  }

  // Multiple modules
  const moduleList = modules.map(m => m.toUpperCase()).join(', ');
  return `Update Parameters Across ${moduleList} Modules`;
}

/**
 * Generate a detailed proposal summary from parameter selections.
 * Creates a markdown-formatted summary with module sections, parameter changes,
 * and a placeholder for rationale that users should customize.
 *
 * @param {ParameterSelection[]} selections - Array of parameter selections
 * @returns {string} A markdown-formatted summary with parameter details grouped by module
 * @example
 * const selections = [{module: 'vm', parameter: 'evm_denom', value: 'aevmos', description: 'Test update'}];
 * const summary = generateParameterChangeSummary(selections);
 * // Returns formatted markdown with module sections and parameter changes
 */
export function generateParameterChangeSummary(selections: ParameterSelection[]): string {
  if (selections.length === 0) return '';

  const lines: string[] = [
    'This proposal updates the following chain parameters:',
    '',
  ];

  // Group by module
  const byModule = selections.reduce((acc, sel) => {
    if (!acc[sel.module]) acc[sel.module] = [];
    acc[sel.module].push(sel);
    return acc;
  }, {} as Record<string, ParameterSelection[]>);

  Object.entries(byModule).forEach(([module, params]) => {
    const moduleName = module.toUpperCase();
    lines.push(`**${moduleName} Module:**`);

    params.forEach(param => {
      const paramName = param.parameter.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const valueStr = formatValueForDisplay(param.value);
      lines.push(`- ${paramName}: ${valueStr}`);
      if (param.description) {
        lines.push(`  _${param.description}_`);
      }
    });
    lines.push('');
  });

  lines.push('**Rationale:**');
  lines.push('These parameter changes are proposed to [add rationale here - edit as needed].');

  return lines.join('\n');
}

/**
 * Format a parameter value for display in the summary.
 * Handles booleans, strings, numbers, arrays, and objects with appropriate formatting.
 *
 * @param {any} value - The parameter value to format
 * @returns {string} A human-readable string representation of the value
 * @private
 * @example
 * formatValueForDisplay(true); // Returns: "Enabled"
 * formatValueForDisplay("test"); // Returns: "\"test\""
 * formatValueForDisplay([1,2,3]); // Returns: "[1, 2, 3]"
 */
function formatValueForDisplay(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'Enabled' : 'Disabled';
  }

  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length <= 3) {
      return `[${value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]`;
    }
    return `[${value.length} items]`;
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

/**
 * Generate title for community pool spend proposal.
 * Creates a concise title showing the recipient and amount(s) being requested.
 *
 * @param {string} recipient - The bech32 address receiving the funds
 * @param {Array<{amount: string, denom: string}>} amount - Array of coin amounts and denominations
 * @returns {string} A formatted title with shortened address and amounts
 * @example
 * generateCommunitySpendTitle('cosmos1abc...xyz', [{amount: '1000000', denom: 'uatom'}]);
 * // Returns: "Community Pool Spend: 1000000 uatom to cosmos1abc...xyz"
 */
export function generateCommunitySpendTitle(recipient: string, amount: Array<{ amount: string; denom: string }>): string {
  const totalStr = amount.map(a => `${a.amount} ${a.denom}`).join(', ');
  const shortAddr = recipient.length > 20 ? `${recipient.slice(0, 10)}...${recipient.slice(-8)}` : recipient;
  return `Community Pool Spend: ${totalStr} to ${shortAddr}`;
}

/**
 * Generate summary for community pool spend proposal.
 * Creates markdown-formatted summary with recipient, amounts, and editable placeholders
 * for purpose and expected outcomes.
 *
 * @param {string} recipient - The bech32 address receiving the funds
 * @param {Array<{amount: string, denom: string}>} amount - Array of coin amounts
 * @returns {string} Markdown-formatted summary with editable sections
 */
export function generateCommunitySpendSummary(recipient: string, amount: Array<{ amount: string; denom: string }>): string {
  const amountList = amount.map(a => `- ${a.amount} ${a.denom}`).join('\n');

  return `This proposal requests funds from the community pool to be sent to the following address:

**Recipient:** ${recipient}

**Amount:**
${amountList}

**Purpose:**
[Describe the purpose of this community pool spend - edit as needed]

**Expected Outcome:**
[Describe the expected benefits to the community - edit as needed]`;
}

/**
 * Generate title for software upgrade proposal.
 *
 * @param {string} name - The upgrade name/version
 * @param {string} height - The block height for the upgrade
 * @returns {string} Formatted title
 */
export function generateSoftwareUpgradeTitle(name: string, height: string): string {
  return `Software Upgrade: ${name} at Block ${height}`;
}

/**
 * Generate summary for software upgrade proposal.
 * Includes upgrade details and preparation instructions for validators.
 *
 * @param {string} name - The upgrade name/version
 * @param {string} height - The block height
 * @param {string} info - JSON string with upgrade metadata
 * @returns {string} Markdown-formatted summary
 */
export function generateSoftwareUpgradeSummary(name: string, height: string, info: string): string {
  return `This proposal schedules a software upgrade for the chain.

**Upgrade Name:** ${name}
**Upgrade Height:** ${height}
**Information:** ${info || 'No additional information provided'}

**Changes:**
[Describe the changes included in this upgrade - edit as needed]

**Preparation:**
Validators and node operators should prepare to upgrade their software before block ${height}.

**Resources:**
[Add links to upgrade documentation, binaries, or instructions - edit as needed]`;
}

/**
 * Generate title for IBC client params proposal.
 *
 * @param {string[]} allowedClients - Array of allowed IBC client type strings
 * @returns {string} Formatted title
 */
export function generateIbcClientTitle(allowedClients: string[]): string {
  if (allowedClients.length === 1) {
    return `Update IBC Allowed Client: ${allowedClients[0]}`;
  }
  return `Update IBC Allowed Clients (${allowedClients.length} types)`;
}

/**
 * Generate summary for IBC client params proposal.
 * Lists allowed client types with sections for rationale and security considerations.
 *
 * @param {string[]} allowedClients - Array of allowed IBC client type strings
 * @returns {string} Markdown-formatted summary
 */
export function generateIbcClientSummary(allowedClients: string[]): string {
  const clientList = allowedClients.map(c => `- ${c}`).join('\n');

  return `This proposal updates the allowed IBC client types for cross-chain communication.

**Allowed Client Types:**
${clientList}

**Rationale:**
[Explain why these client types should be allowed - edit as needed]

**Security Considerations:**
[Describe any security implications - edit as needed]`;
}

/**
 * Generate title for EVM preinstall registration.
 *
 * @param {Array<{name: string}>} preinstalls - Array of preinstall contract objects
 * @returns {string} Formatted title
 */
export function generatePreinstallTitle(preinstalls: Array<{ name: string }>): string {
  if (preinstalls.length === 1) {
    return `Register Preinstalled Contract: ${preinstalls[0].name}`;
  }
  return `Register ${preinstalls.length} Preinstalled Contracts`;
}

/**
 * Generate summary for EVM preinstall registration.
 * Lists contracts with addresses and truncated bytecode.
 *
 * @param {Array<{name: string, address: string, code: string}>} preinstalls - Array of preinstall contracts
 * @returns {string} Markdown-formatted summary
 */
export function generatePreinstallSummary(preinstalls: Array<{ name: string; address: string; code: string }>): string {
  const contractList = preinstalls.map(p =>
    `- **${p.name}**\n  Address: ${p.address}\n  Bytecode: ${p.code.slice(0, 66)}...`
  ).join('\n\n');

  return `This proposal registers preinstalled smart contracts in the EVM state.

**Contracts:**
${contractList}

**Purpose:**
[Describe the purpose of these preinstalled contracts - edit as needed]

**Verification:**
[Add information about contract verification and audits - edit as needed]`;
}

/**
 * Generate title for ERC20 registration.
 *
 * @param {string[]} addresses - Array of ERC20 contract addresses (0x-prefixed hex)
 * @returns {string} Formatted title with shortened address for single registration
 */
export function generateErc20RegistrationTitle(addresses: string[]): string {
  if (addresses.length === 1) {
    const shortAddr = addresses[0].slice(0, 10) + '...' + addresses[0].slice(-6);
    return `Register ERC20 Token: ${shortAddr}`;
  }
  return `Register ${addresses.length} ERC20 Tokens`;
}

/**
 * Generate summary for ERC20 registration.
 * Lists contract addresses and explains the conversion capability.
 *
 * @param {string[]} addresses - Array of ERC20 contract addresses
 * @returns {string} Markdown-formatted summary
 */
export function generateErc20RegistrationSummary(addresses: string[]): string {
  const addressList = addresses.map(a => `- ${a}`).join('\n');

  return `This proposal registers ERC20 token contracts for Cosmos Coin conversion.

**ERC20 Contracts:**
${addressList}

**Purpose:**
These tokens will be enabled for bidirectional conversion between ERC20 and Cosmos Coin formats.

**Token Details:**
[Add information about the tokens being registered - edit as needed]`;
}

/**
 * Generate title for token conversion toggle.
 *
 * @param {string} token - Token identifier (either 0x-prefixed ERC20 address or Cosmos denom)
 * @returns {string} Formatted title with shortened address if applicable
 */
export function generateToggleConversionTitle(token: string): string {
  const isAddress = token.startsWith('0x');
  const displayToken = isAddress
    ? `${token.slice(0, 10)}...${token.slice(-6)}`
    : token;
  return `Toggle Conversion for ${displayToken}`;
}

/**
 * Generate summary for token conversion toggle.
 * Explains the toggle action and includes sections for rationale and impact.
 *
 * @param {string} token - Token identifier (either 0x address or Cosmos denom)
 * @returns {string} Markdown-formatted summary
 */
export function generateToggleConversionSummary(token: string): string {
  const tokenType = token.startsWith('0x') ? 'ERC20 contract' : 'Cosmos denomination';

  return `This proposal toggles the conversion status for the following token.

**Token Identifier:** ${token}
**Type:** ${tokenType}

**Action:**
If conversion is currently enabled, this will disable it. If disabled, this will enable it.

**Rationale:**
[Explain why conversion should be toggled - edit as needed]

**Impact:**
[Describe the impact on users and applications - edit as needed]`;
}
