# Chain Orchestrator - Outstanding Tasks

**Last Updated**: 2025-10-01
**Foundation Status**:  Complete (100%)
**Implementation Status**:  Pending (0%)

---

##  Quick Reference

**Total Tasks**: ~127 remaining
**Critical Path**: Utilities → Custom Components → Wallet → State Management
**Top Priority**: Governance UI (per requirements)

---

##  Phase 1: Custom Components (8 tasks)

### 1. AccessControlEditor
**File**: `src/components/custom/AccessControlEditor.tsx`
**Purpose**: UI for EVM access control (create/call permissions)
**Complexity**: High
**Dependencies**: shadcn select, input, badge, radio-group

**Features**:
- Select access type (PERMISSIONLESS, RESTRICTED, PERMISSIONED)
- Address list management for allowlist/blocklist
- Validation for Cosmos/0x addresses
- Visual feedback for permission state

**Data Structure** (from params.ts):
```typescript
{
  create: {
    access_type: 'ACCESS_TYPE_PERMISSIONLESS' | 'ACCESS_TYPE_RESTRICTED' | 'ACCESS_TYPE_PERMISSIONED',
    access_control_list: string[]
  },
  call: {
    access_type: 'ACCESS_TYPE_PERMISSIONLESS' | 'ACCESS_TYPE_RESTRICTED' | 'ACCESS_TYPE_PERMISSIONED',
    access_control_list: string[]
  }
}
```

---

### 2. PrecompileSelector
**File**: `src/components/custom/PrecompileSelector.tsx`
**Purpose**: Multi-select for active precompile addresses
**Complexity**: Medium
**Dependencies**: shadcn combobox, badge, alert

**Features**:
- Multi-select from available precompiles
- Address validation (0x format, 40 hex chars)
- Automatic sorting enforcement
- Duplicate detection
- Display precompile names

**Available Precompiles** (from evmd-comprehensive-data.md):
```typescript
const PRECOMPILES = [
  { address: '0x0000000000000000000000000000000000000802', name: 'ICS20' },
  { address: '0x...', name: 'Bank' },
  { address: '0x...', name: 'Bech32' },
  { address: '0x...', name: 'Distribution' },
  { address: '0x...', name: 'ERC20' },
  { address: '0x...', name: 'Gov' },
  { address: '0x...', name: 'P256' },
  { address: '0x...', name: 'Slashing' },
  { address: '0x...', name: 'Staking' },
  { address: '0x...', name: 'WERC20' }
];
```

---

### 3. CliPreviewPanel
**File**: `src/components/custom/CliPreviewPanel.tsx`
**Purpose**: Live CLI command generation
**Complexity**: Medium
**Dependencies**: prism-react-renderer, shadcn button, scroll-area

**Features**:
- Syntax highlighting for CLI commands
- Real-time updates as form changes
- Copy to clipboard
- Show all flags and arguments

**Example Output**:
```bash
evmd tx gov submit-proposal proposal.json --deposit 10000000atest --from mykey --chain-id evm-262144-1 --gas auto --gas-prices 10atest
```

---

### 4. ProposalJsonPreview
**File**: `src/components/custom/ProposalJsonPreview.tsx`
**Purpose**: Side-by-side JSON and CLI preview
**Complexity**: Medium
**Dependencies**: @monaco-editor/react, prism-react-renderer, shadcn tabs

**Features**:
- JSON editor with validation
- CLI command preview
- Tab switching between views
- Export JSON functionality
- Format/prettify options

**Example JSON** (from params.ts):
```json
{
  "messages": [{
    "@type": "/cosmos.evm.vm.v1.MsgUpdateParams",
    "authority": "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
    "params": { /* ... */ }
  }],
  "metadata": "Update VM parameters",
  "deposit": "10000000atest",
  "title": "Update EVM Module Parameters",
  "summary": "Proposal to update EVM module parameters"
}
```

---

### 5. AddressInput
**File**: `src/components/custom/AddressInput.tsx`
**Purpose**: Smart input for Cosmos (bech32) and EVM (0x) addresses
**Complexity**: Medium
**Dependencies**: shadcn input, badge, bech32 library

**Features**:
- Auto-detect address format
- Convert between cosmos0x
- Real-time validation
- Display both formats
- Copy both formats

**Example**:
```
Input: 0x7cB61D4117AE31a12E393a1Cfa3BaC666481D02E
Converted: cosmos10jmp6sgh4cc6zt3e8gw05wavvejgr5pwjskvv
```

---

### 6. CoinInput
**File**: `src/components/custom/CoinInput.tsx`
**Purpose**: Amount input with denomination selector
**Complexity**: Low
**Dependencies**: shadcn input, select

**Features**:
- Number formatting
- Denomination dropdown (atest, ATOM, etc.)
- Decimal precision handling (18 decimals for EVMD)
- Display conversion (1000000000000000000 atest = 1 TEST)
- Max balance button

---

### 7. ChainConfigSelector
**File**: `src/components/custom/ChainConfigSelector.tsx`
**Purpose**: Switch between chain configurations
**Complexity**: Medium
**Dependencies**: shadcn select, avatar

**Features**:
- Chain selection dropdown
- Display chain logo/icon
- Show chain ID and RPC status
- Switch entire app context
- Support evmd, gaiad, etc.

**Chain Configs**:
```typescript
const chains = [
  { name: 'Cosmos EVM', binary: 'evmd', chainId: 'evm-262144-1', logo: '...' },
  { name: 'Cosmos Hub', binary: 'gaiad', chainId: 'cosmoshub-4', logo: '...' }
];
```

---

### 8. BatchTxBuilder
**File**: `src/components/custom/BatchTxBuilder.tsx`
**Purpose**: Build multi-message transactions with drag-and-drop
**Complexity**: High
**Dependencies**: @dnd-kit/core, @dnd-kit/sortable, shadcn table, button

**Features**:
- Add/remove messages
- Drag to reorder
- Message type selector
- Per-message configuration
- Gas estimation for batch
- Preview all messages

---

##  Phase 2: Governance UI (7 tasks)

### 1. ProposalWizard
**File**: `src/components/governance/ProposalWizard.tsx`
**Complexity**: High

**Steps**:
1. Select proposal type (VM params, ERC20 params, Feemarket params, Register Preinstalls, Register ERC20, Toggle Conversion)
2. Configure parameters (conditional form based on type)
3. Add metadata (title, summary, deposit)
4. Review JSON and CLI
5. Submit via wallet

---

### 2. VmParamsForm
**File**: `src/components/governance/VmParamsForm.tsx`
**Complexity**: High
**Dependencies**: AccessControlEditor, PrecompileSelector

**Fields** (from evmdVmParams):
- `evm_denom` - Input (default: "atest")
- `allow_unprotected_txs` - Switch (default: false)
- `extra_eips` - Multi-select with validation (default: [])
- `active_static_precompiles` - PrecompileSelector (default: [])
- `evm_channels` - Array input (default: [])
- `access_control` - AccessControlEditor (complex nested object)

---

### 3. Erc20ParamsForm
**File**: `src/components/governance/Erc20ParamsForm.tsx`
**Complexity**: Low

**Fields** (from evmdErc20Params):
- `enable_erc20` - Switch (default: true)
- `permissionless_registration` - Switch (default: true)

---

### 4. FeemarketParamsForm
**File**: `src/components/governance/FeemarketParamsForm.tsx`
**Complexity**: Medium

**Fields** (from evmdFeemarketParams):
- `no_base_fee` - Switch (default: false)
- `base_fee_change_denominator` - Number input >0 (default: 8)
- `elasticity_multiplier` - Number input >0 (default: 2)
- `base_fee` - String input (default: "1000000000")
- `enable_height` - Number input ≥0 (default: 0)
- `min_gas_price` - String input (default: "0")
- `min_gas_multiplier` - Slider 0-1 (default: "0.5")

---

### 5. ProposalList
**File**: `src/components/governance/ProposalList.tsx`
**Complexity**: Medium
**Dependencies**: @tanstack/react-table, shadcn data-table

**Features**:
- Filter by status (VOTING, PASSED, REJECTED, DEPOSIT_PERIOD)
- Sort by ID, end time, status
- Pagination
- Search by title
- Status badges
- Click for details

**Query**: `evmd query gov proposals --status voting`

---

### 6. ProposalDetailView
**File**: `src/components/governance/ProposalDetailView.tsx`
**Complexity**: Medium

**Features**:
- Proposal metadata
- Messages breakdown
- Voting breakdown (yes/no/abstain/veto %)
- Vote button
- Deposit button
- Timeline/countdown

---

### 7. VoteInterface
**File**: `src/components/governance/VoteInterface.tsx`
**Complexity**: Medium

**Features**:
- Vote option radio (yes, no, abstain, no_with_veto)
- Optional memo
- Gas estimation
- Wallet signing
- Confirmation dialog
- Success/error feedback

**CLI**: `evmd tx gov vote <proposal-id> <option> --from <key>`

---

##  Phase 3: Query Forms (30 tasks)

### VM Module Queries (8 forms)
**Directory**: `src/components/queries/vm/`

1. **QueryAccountForm** - `evmd query vm account [address]`
2. **QueryCodeForm** - `evmd query vm code [address]`
3. **QueryStorageForm** - `evmd query vm storage [address] [key]`
4. **QueryBalanceBankForm** - `evmd query vm balance-bank [0x-address] [denom]`
5. **QueryBalanceErc20Form** - `evmd query vm balance-erc20 [0x-address] [erc20-address]`
6. **QueryParamsForm** - `evmd query vm params` (no inputs)
7. **QueryConfigForm** - `evmd query vm config` (no inputs)
8. **AddressConversionForm** - `evmd query vm 0x-to-bech32 / bech32-to-0x`

---

### ERC20 Module Queries (3 forms)
**Directory**: `src/components/queries/erc20/`

1. **QueryTokenPairsForm** - `evmd query erc20 token-pairs` (pagination)
2. **QueryTokenPairForm** - `evmd query erc20 token-pair [token]`
3. **QueryParamsForm** - `evmd query erc20 params`

---

### Fee Market Module Queries (3 forms)
**Directory**: `src/components/queries/feemarket/`

1. **QueryBaseFeeForm** - `evmd query feemarket base-fee`
2. **QueryBlockGasForm** - `evmd query feemarket block-gas`
3. **QueryParamsForm** - `evmd query feemarket params`

---

### Precise Bank Module Queries (2 forms)
**Directory**: `src/components/queries/precisebank/`

1. **QueryRemainderForm** - `evmd query precisebank remainder`
2. **QueryFractionalBalanceForm** - `evmd query precisebank fractional-balance [address]`

---

### Standard Cosmos Queries (14 forms)
**Directory**: `src/components/queries/{bank,staking,distribution,gov}/`

**Bank**:
1. QueryBalances - `evmd query bank balances [address]`
2. QueryBalance - `evmd query bank balance [address] [denom]`
3. QueryTotal - `evmd query bank total`

**Staking**:
4. QueryValidators - `evmd query staking validators`
5. QueryDelegations - `evmd query staking delegations [delegator]`
6. QueryUnbondingDelegations - `evmd query staking unbonding-delegations [delegator]`

**Distribution**:
7. QueryRewards - `evmd query distribution rewards [delegator] [validator]`
8. QueryCommission - `evmd query distribution commission [validator]`

**Gov**:
9. QueryProposals - `evmd query gov proposals`
10. QueryProposal - `evmd query gov proposal [id]`
11. QueryVotes - `evmd query gov votes [id]`
12. QueryDeposits - `evmd query gov deposits [id]`
13. QueryTally - `evmd query gov tally [id]`
14. QueryParams - `evmd query gov params`

---

### Query Result Display Component
**File**: `src/components/queries/QueryResultDisplay.tsx`

**Features**:
- JSON viewer (react-json-view-lite)
- Copy result button
- Export to JSON/CSV
- Pretty formatting
- Error handling
- Loading states

---

##  Phase 4: Transaction Forms (15 tasks)

### VM Module Transactions (2 forms)
**Directory**: `src/components/transactions/vm/`

1. **SendTxForm** - `evmd tx vm send [from] [to] [amount]`
   - Support 0x and bech32 addresses
   - CoinInput component
   - Gas estimation

2. **RawTxForm** - `evmd tx vm raw [hex-encoded-tx]`
   - Hex input
   - TX decoding preview

---

### ERC20 Module Transactions (4 forms)
**Directory**: `src/components/transactions/erc20/`

1. **ConvertCoinForm** - `evmd tx erc20 convert-coin [coin] [receiver]`
2. **ConvertErc20Form** - `evmd tx erc20 convert-erc20 [contract] [amount] [receiver]`
3. **RegisterErc20Form** - `evmd tx erc20 register-erc20 [addresses...]` (governance)
4. **ToggleConversionForm** - `evmd tx erc20 toggle-conversion [token]` (governance)

---

### Standard Cosmos Transactions (9 forms)
**Directory**: `src/components/transactions/{bank,staking,distribution}/`

**Bank**:
1. SendForm - `evmd tx bank send`
2. MultiSendForm - `evmd tx bank multi-send`

**Staking**:
3. DelegateForm - `evmd tx staking delegate`
4. RedelegateForm - `evmd tx staking redelegate`
5. UndelegateForm - `evmd tx staking undelegate`

**Distribution**:
6. WithdrawRewardsForm - `evmd tx distribution withdraw-rewards`
7. WithdrawCommissionForm - `evmd tx distribution withdraw-rewards [validator] --commission`
8. SetWithdrawAddressForm - `evmd tx distribution set-withdraw-addr`

**Gov** (already in Phase 2):
9. SubmitProposalForm
10. DepositForm
11. VoteForm

---

### Transaction Execution Flow
**File**: `src/lib/tx/executor.ts`

**Features**:
- Form validation (Zod schemas)
- Gas estimation
- Fee calculation
- Wallet signing modal
- Broadcasting
- TX status tracking
- Success/error toasts
- TX hash display with explorer link
- Retry logic

---

##  Phase 5: Validator Workspace (5 tasks)

### 1. Validator Dashboard
**File**: `src/pages/Validator.tsx`

**Features**:
- Validator info display
- Active proposals list
- Commission balance
- Delegator count
- Quick action buttons

---

### 2. Commission Withdrawal
**File**: `src/components/validator/CommissionWithdraw.tsx`

**Features**:
- Display current commission
- Withdraw button
- Gas estimation
- Wallet signing

**CLI**: `evmd tx distribution withdraw-rewards [valoper] --commission`

---

### 3. Delegator Manager
**File**: `src/components/validator/DelegatorManager.tsx`

**Features**:
- Query: `evmd query staking delegations-to [valoper]`
- Data table with sorting/filtering
- Show: address, amount, rewards
- Export to CSV
- Export to JSON
- Pagination

---

### 4. Multi-Send Payout Builder
**File**: `src/components/validator/MultiSendPayouts.tsx`
**Complexity**: High

**Features**:
- CSV import (papaparse)
- Manual entry
- Recipient table with edit/remove
- Total sum validation
- Batch splitting (100 msgs per TX)
- Gas estimation per batch
- Execute sequentially
- Progress tracking
- Error handling & retry

**CSV Format**:
```csv
address,amount
cosmos1...,1000000
cosmos2...,2000000
```

---

### 5. Batch Voting Interface
**File**: `src/components/validator/BatchVoting.tsx`

**Features**:
- List all proposals in voting period
- Vote option per proposal
- Submit all votes in one TX
- Track voting history

---

##  Phase 6: Wallet Integration (6 tasks)

### 1. Keplr Adapter
**File**: `src/lib/wallet/keplr.ts`

**Features**:
- `connect()` - Enable Keplr
- `suggestChain()` - Add EVMD config
- `getOfflineSigner()` - Get signer
- `signTransaction()` - Sign TX
- `disconnect()` - Cleanup

**Chain Config** (from evmd data):
```typescript
{
  chainId: 'evm-262144-1',
  chainName: 'Cosmos EVM',
  rpc: 'http://localhost:26657',
  rest: 'http://localhost:1317',
  bip44: { coinType: 60 }, // ETH
  bech32Config: { bech32PrefixAccAddr: 'cosmos', /* ... */ },
  currencies: [{ coinDenom: 'TEST', coinMinimalDenom: 'atest', coinDecimals: 18 }],
  feeCurrencies: [{ /* ... */ }],
  stakeCurrency: { /* ... */ }
}
```

---

### 2. Leap Adapter
**File**: `src/lib/wallet/leap.ts`

Same API as Keplr, uses `window.leap` instead

---

### 3. Ledger Adapter
**File**: `src/lib/wallet/ledger.ts`
**Dependencies**: @cosmjs/ledger-amino

**Features**:
- WebHID transport
- Connect to device
- Sign transactions
- Error handling
- Connection status

---

### 4. Wallet Provider
**File**: `src/lib/wallet/WalletProvider.tsx`

**Context State**:
```typescript
{
  wallet: 'keplr' | 'leap' | 'ledger' | null,
  address: string | null,
  connected: boolean,
  balance: Coin[],
  connect: (type) => Promise<void>,
  disconnect: () => void,
  signAndBroadcast: (msgs, fee) => Promise<TxResult>
}
```

---

### 5. Transaction Builder
**File**: `src/lib/tx/builder.ts`

**Functions**:
- `buildMessage(type, values)` - Create message from form
- `estimateGas(msgs)` - Estimate gas
- `calculateFee(gas, gasPrice)` - Calculate fee
- `buildTx(msgs, fee, memo)` - Build complete TX

---

### 6. Transaction Executor
**File**: `src/lib/tx/executor.ts`

**Functions**:
- `executeQuery(endpoint, params)` - RPC query
- `broadcastTx(signedTx)` - Broadcast
- `pollTxStatus(hash)` - Wait for confirmation
- `parseTxResponse(response)` - Extract data

---

##  Phase 7: Pages & Routing (6 tasks)

### 1. Dashboard Page
**File**: `src/pages/Dashboard.tsx`
**Route**: `/`

**Sections**:
- Quick actions (query account, send, convert)
- Recent proposals (5 most recent)
- Chain status (height, validators, etc.)
- Module stats

---

### 2. Governance Page
**File**: `src/pages/Governance.tsx`
**Route**: `/governance`

**Features**:
- ProposalList with tabs (active, passed, rejected, deposit)
- New Proposal button → ProposalWizard
- Filters and search

---

### 3. Modules Page
**File**: `src/pages/Module.tsx`
**Route**: `/modules/:module`

**Modules**: vm, erc20, feemarket, precisebank

**Tabs**:
- Queries (module-specific query forms)
- Transactions (module-specific TX forms)
- Parameters (display current params)

---

### 4. Validator Page
**File**: `src/pages/Validator.tsx`
**Route**: `/validator`

**Features**:
- Validator workspace
- Commission withdrawal
- Delegator manager
- Multi-send payouts
- Batch voting

---

### 5. Transactions Page
**File**: `src/pages/Transactions.tsx`
**Route**: `/transactions`

**Features**:
- Transaction history
- Filter by type, status
- TX detail view

---

### 6. Settings Page
**File**: `src/pages/Settings.tsx`
**Route**: `/settings`

**Features**:
- ChainConfigSelector
- RPC endpoint input
- Theme toggle (light/dark)
- Wallet management

---

### Router Setup
**File**: `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/governance" element={<Governance />} />
    <Route path="/modules/:module" element={<Module />} />
    <Route path="/validator" element={<Validator />} />
    <Route path="/transactions" element={<Transactions />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</BrowserRouter>
```

---

##  Phase 8: State Management (3 tasks)

### 1. Wallet Store
**File**: `src/store/wallet.ts`

```typescript
import { create } from 'zustand';

interface WalletState {
  wallet: 'keplr' | 'leap' | 'ledger' | null;
  address: string | null;
  balance: Coin[];
  connected: boolean;
  setWallet: (wallet, address) => void;
  setBalance: (balance) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({ /* ... */ }));
```

---

### 2. Chain Store
**File**: `src/store/chain.ts`

```typescript
interface ChainState {
  config: ChainConfig;
  rpc: string;
  rest: string;
  status: 'connected' | 'disconnected' | 'error';
  blockHeight: number;
  setChain: (config) => void;
  updateStatus: (status) => void;
}

export const useChainStore = create<ChainState>((set) => ({ /* ... */ }));
```

---

### 3. Transaction Store
**File**: `src/store/transactions.ts`

```typescript
interface TxState {
  pending: Transaction[];
  history: Transaction[];
  addPending: (tx) => void;
  updateTx: (hash, status) => void;
  clearPending: () => void;
}

export const useTxStore = create<TxState>((set) => ({ /* ... */ }));
```

---

##  Phase 9: React Query Hooks (10 tasks)

**Directory**: `src/hooks/`

### 1. useWallet
```typescript
export function useWallet() {
  const store = useWalletStore();
  const keplr = useKeplr();
  const leap = useLeap();

  return {
    connect: async (type) => { /* ... */ },
    disconnect: () => { /* ... */ },
    ...store
  };
}
```

---

### 2. useBalance
```typescript
export function useBalance(address?: string) {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: () => queryBalance(address),
    refetchInterval: 30000 // 30s
  });
}
```

---

### 3. useProposals
```typescript
export function useProposals(status?: ProposalStatus) {
  return useQuery({
    queryKey: ['proposals', status],
    queryFn: () => queryProposals(status)
  });
}
```

---

### 4. useProposal
```typescript
export function useProposal(id: string) {
  return useQuery({
    queryKey: ['proposal', id],
    queryFn: () => queryProposal(id)
  });
}
```

---

### 5. useValidators
```typescript
export function useValidators() {
  return useQuery({
    queryKey: ['validators'],
    queryFn: () => queryValidators()
  });
}
```

---

### 6. useDelegations
```typescript
export function useDelegations(delegator: string) {
  return useQuery({
    queryKey: ['delegations', delegator],
    queryFn: () => queryDelegations(delegator)
  });
}
```

---

### 7. useTokenPairs
```typescript
export function useTokenPairs() {
  return useQuery({
    queryKey: ['tokenPairs'],
    queryFn: () => queryTokenPairs()
  });
}
```

---

### 8. useParams
```typescript
export function useParams(module: string) {
  return useQuery({
    queryKey: ['params', module],
    queryFn: () => queryParams(module)
  });
}
```

---

### 9. useTransaction
```typescript
export function useTransaction() {
  return useMutation({
    mutationFn: (tx: Transaction) => broadcastTx(tx),
    onSuccess: (result) => {
      // Track in store
      // Show toast
    }
  });
}
```

---

### 10. useChain
```typescript
export function useChain() {
  const store = useChainStore();

  return useQuery({
    queryKey: ['chainStatus'],
    queryFn: () => queryChainStatus(),
    onSuccess: (data) => {
      store.updateStatus('connected');
      store.setBlockHeight(data.height);
    }
  });
}
```

---

##  Phase 10: Utilities (3 tasks)

### 1. Address Utilities
**File**: `src/lib/utils/address.ts`

```typescript
import { toBech32, fromBech32 } from '@cosmjs/encoding';
import { bech32 } from 'bech32';

export function cosmosToHex(address: string): string {
  const { data } = fromBech32(address);
  return '0x' + Buffer.from(data).toString('hex');
}

export function hexToCosmos(hex: string, prefix = 'cosmos'): string {
  const data = Buffer.from(hex.replace('0x', ''), 'hex');
  return toBech32(prefix, data);
}

export function isValidCosmosAddress(address: string): boolean {
  try {
    fromBech32(address);
    return true;
  } catch {
    return false;
  }
}

export function isValidHexAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function truncateAddress(address: string, chars = 8): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
```

---

### 2. Format Utilities
**File**: `src/lib/utils/format.ts`

```typescript
import { format } from 'date-fns';

export function formatCoin(amount: string, denom: string, decimals = 18): string {
  const num = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const whole = num / divisor;
  const fraction = num % divisor;

  return `${whole}.${fraction.toString().padStart(decimals, '0')} ${denom.toUpperCase()}`;
}

export function formatDate(timestamp: number | Date): string {
  return format(new Date(timestamp), 'MMM d, yyyy HH:mm');
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(2)}%`;
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toString();
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}
```

---

### 3. Validation Utilities
**File**: `src/lib/utils/validation.ts`

```typescript
import { z } from 'zod';

// Valid EIPs from go-ethereum
const VALID_EIPS = [2200, 2929, 3198, 3529, 3855, 4399];

export function validateEIPs(eips: number[]): boolean {
  return eips.every(eip => VALID_EIPS.includes(eip));
}

export function validatePrecompiles(addresses: string[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check format
  const invalidFormat = addresses.filter(addr =>
    !/^0x[a-fA-F0-9]{40}$/.test(addr)
  );
  if (invalidFormat.length > 0) {
    errors.push(`Invalid format: ${invalidFormat.join(', ')}`);
  }

  // Check duplicates
  const seen = new Set();
  const duplicates = addresses.filter(addr => {
    if (seen.has(addr)) return true;
    seen.add(addr);
    return false;
  });
  if (duplicates.length > 0) {
    errors.push(`Duplicates: ${duplicates.join(', ')}`);
  }

  // Check sorted
  const sorted = [...addresses].sort();
  if (JSON.stringify(addresses) !== JSON.stringify(sorted)) {
    errors.push('Addresses must be sorted');
  }

  return { valid: errors.length === 0, errors };
}

export function validateAccessControl(ac: AccessControl): boolean {
  const schema = evmdVmParams.access_control.validation;
  try {
    schema.parse(ac);
    return true;
  } catch {
    return false;
  }
}

export function validateProposalJson(json: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const proposal = JSON.parse(json);

    if (!proposal.messages || !Array.isArray(proposal.messages)) {
      return { valid: false, error: 'Missing messages array' };
    }

    if (!proposal.title || !proposal.summary) {
      return { valid: false, error: 'Missing title or summary' };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: `JSON parse error: ${e.message}` };
  }
}
```

---

##  Phase 11: Branding & Assets (10 tasks)

### Assets Needed
**Directory**: `public/`

1. **Cosmos Logo (Light)** - `public/cosmos-logo-light.svg`
2. **Cosmos Logo (Dark)** - `public/cosmos-logo-dark.svg`
3. **Favicon** - `public/favicon.svg` (replace vite.svg)
4. **App Icon 192** - `public/icons/icon-192.png`
5. **App Icon 512** - `public/icons/icon-512.png`
6. **Module Icons** - `public/icons/modules/{vm,erc20,feemarket}.svg`
7. **Wallet Icons** - `public/icons/wallets/{keplr,leap,ledger}.svg`

### Code Updates

8. **Update index.html**
```html
<head>
  <title>Cosmos Chain Orchestrator</title>
  <link rel="icon" type="image/svg+xml" href="/cosmos-logo-light.svg" />
  <meta name="description" content="Universal chain orchestrator for Cosmos SDK chains" />
</head>
```

9. **Create App Header**
**File**: `src/components/layout/Header.tsx`
- Cosmos logo (theme-aware)
- Chain selector
- Wallet connection button
- Navigation menu

10. **Create Footer**
**File**: `src/components/layout/Footer.tsx`
- Cosmos attribution
- Links (docs, GitHub, Discord)
- Version number

---

##  Phase 12: Documentation (7 tasks)

### 1. Component Documentation
**Option A**: Storybook
**Option B**: Manual markdown in `docs/components/`

Document all 8 custom components with:
- Props interface
- Usage examples
- Visual examples

---

### 2. API Documentation
**File**: `docs/API.md`

Document:
- All hooks and their usage
- Wallet integration
- Transaction building
- Query execution

---

### 3. User Guide
**File**: `docs/USER_GUIDE.md`

Sections:
- Getting started
- Connecting wallet
- Querying chain data
- Sending transactions
- Creating governance proposals
- Validator tools

---

### 4. Developer Setup
**File**: `docs/SETUP.md`

Sections:
- Prerequisites
- Installation
- Running locally
- Building for production
- Environment variables

---

### 5. Contribution Guidelines
**File**: `CONTRIBUTING.md`

Sections:
- Code style
- PR process
- Testing requirements
- Commit message format

---

### 6. Governance Templates
**File**: `docs/GOVERNANCE_TEMPLATES.md`

Provide JSON templates for:
- VM parameter changes
- ERC20 parameter changes
- Fee market parameter changes
- Register preinstalls
- Register ERC20 tokens
- Toggle conversion

---

### 7. Troubleshooting Guide
**File**: `docs/TROUBLESHOOTING.md`

Common issues:
- Wallet connection failures
- Transaction errors
- RPC timeouts
- Gas estimation issues

---

##  Phase 13: Testing (8 tasks)

### Unit Tests

**Test Files**: `*.test.ts` next to source files

1. **Parameter Schemas** - `src/lib/chains/evmd/params.test.ts`
   - Validate all parameter defaults
   - Test Zod validation
   - Test type inference

2. **Address Utilities** - `src/lib/utils/address.test.ts`
   - cosmos0x conversion
   - Address validation
   - Truncation

3. **Format Utilities** - `src/lib/utils/format.test.ts`
   - Coin formatting
   - Date formatting
   - Percentage calculation

4. **Validation Utilities** - `src/lib/utils/validation.test.ts`
   - EIP validation
   - Precompile validation
   - Proposal JSON validation

5. **Proposal Builders** - Test governance message generation

6. **CLI Generators** - Test CLI command building

---

### Integration Tests

7. **Wallet Flow** - Test Keplr/Leap connection and signing

8. **Transaction Flow** - Test query → sign → broadcast → result

---

### E2E Tests (Playwright/Cypress)

**File**: `e2e/governance.spec.ts`

Test scenarios:
- Full governance workflow (create → submit → vote)
- Multi-send payout execution
- Parameter change proposal
- Token conversion flow

---

##  Phase 14: Deployment (7 tasks)

### 1. Build Configuration
**File**: `vite.config.ts`

- Production optimization
- Environment variables
- Source maps
- Bundle analysis

---

### 2. Environment Variables
**File**: `.env.example`

```
VITE_CHAIN_ID=evm-262144-1
VITE_RPC_ENDPOINT=http://localhost:26657
VITE_REST_ENDPOINT=http://localhost:1317
VITE_EXPLORER_URL=https://explorer.example.com
```

---

### 3. Error Boundary
**File**: `src/components/ErrorBoundary.tsx`

Catch and display errors gracefully

---

### 4. Choose Hosting
Options:
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- Self-hosted

---

### 5. CI/CD
**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
```

---

### 6. Domain Configuration
- Register domain
- Configure DNS
- SSL certificate (automatic with Vercel/Netlify)

---

### 7. Monitoring Setup
- Error tracking (Sentry)
- Analytics (optional)
- Performance monitoring (Lighthouse CI)

---

##  Summary Statistics

| Phase | Category | Tasks | Complexity |
|-------|----------|-------|------------|
| 1 | Custom Components | 8 | Medium-High |
| 2 | Governance UI | 7 | High |
| 3 | Query Forms | 30 | Low-Medium |
| 4 | Transaction Forms | 15 | Medium |
| 5 | Validator Tools | 5 | Medium-High |
| 6 | Wallet Integration | 6 | Medium |
| 7 | Pages & Routing | 6 | Low |
| 8 | State Management | 3 | Low |
| 9 | React Query Hooks | 10 | Low-Medium |
| 10 | Utilities | 3 | Low |
| 11 | Branding | 10 | Low |
| 12 | Documentation | 7 | Low |
| 13 | Testing | 8 | Medium |
| 14 | Deployment | 7 | Low-Medium |

**Total**: ~127 tasks

---

##  Recommended Implementation Order

### Tier 1: Foundation (Critical Path)
1. **Utilities** (3 tasks) - Needed everywhere
2. **State Management** (3 tasks) - App-wide context
3. **Wallet Integration** (6 tasks) - Required for all TX operations

### Tier 2: Core Components
4. **Custom Components** (8 tasks) - UI building blocks
5. **React Query Hooks** (10 tasks) - Data fetching

### Tier 3: Primary Features (Per Requirements)
6. **Governance UI** (7 tasks) - **Top priority**
7. **Query Forms** (30 tasks) - Read operations
8. **Transaction Forms** (15 tasks) - Write operations

### Tier 4: Specialized Features
9. **Validator Tools** (5 tasks) - Advanced operations
10. **Pages & Routing** (6 tasks) - Navigation

### Tier 5: Polish
11. **Branding** (10 tasks) - Visual identity
12. **Documentation** (7 tasks) - Guides
13. **Testing** (8 tasks) - Quality
14. **Deployment** (7 tasks) - Production

---

##  Reference Files

**Existing Assets**:
- `src/lib/chains/evmd/params.ts` - All parameter schemas 
- `src/lib/chains/evmd/evmd-comprehensive-data.md` - Full CLI reference 
- `PROJECT_STATUS.md` - Project overview 
- `src/components/ui/*` - All shadcn components 

**Package.json** - All dependencies installed 

---

**Ready to implement - foundation is complete!** 
