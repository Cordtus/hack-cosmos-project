# Comprehensive Implementation Plan
## Fixing All Code Review Issues (P0-P3, excluding Ledger)

---

## PHASE 1: INDIVIDUAL ISSUE PLANS

### **ISSUE P0-1: Implement Wallet signAndBroadcast()**

**Priority:** P0 (BLOCKING)
**Files Affected:**
- `src/lib/wallet/keplr.ts`
- `src/lib/wallet/leap.ts`
- `src/lib/wallet/types.ts`

**Problem:**
```typescript
// Current broken implementation
async signAndBroadcast(...): Promise<string> {
  throw new Error('signAndBroadcast requires RPC endpoint from chain config');
}
```

**Dependencies:**
- Chain store already exists at `src/store/chain.ts` ✅
- Has `ChainConfig` interface with `rpc` property ✅
- CosmJS packages already installed ✅

**Implementation Steps:**

1. **Update WalletAdapter interface with proper types**
   ```typescript
   import type { StdFee } from '@cosmjs/stargate';
   import type { EncodeObject } from '@cosmjs/proto-signing';

   interface WalletAdapter {
     // ... existing methods
     signAndBroadcast(
       chainId: string,
       messages: readonly EncodeObject[],
       fee: StdFee,
       memo?: string
     ): Promise<string>;
   }
   ```

2. **Implement in Keplr adapter**
   ```typescript
   async signAndBroadcast(
     chainId: string,
     messages: readonly EncodeObject[],
     fee: StdFee,
     memo: string = ''
   ): Promise<string> {
     if (!this.keplr) {
       throw new Error('Keplr extension not installed');
     }

     // Get signer
     const offlineSigner = await this.getSigner(chainId);
     const accounts = await offlineSigner.getAccounts();

     if (accounts.length === 0) {
       throw new Error('No accounts available');
     }

     // Get RPC from chain config (need to inject or import)
     // Option A: Pass RPC as parameter
     // Option B: Import useChainStore and get RPC
     // Option C: Make adapter aware of chain store

     // Create signing client
     const client = await SigningStargateClient.connectWithSigner(
       rpcEndpoint,
       offlineSigner
     );

     // Broadcast transaction
     const result = await client.signAndBroadcast(
       accounts[0].address,
       messages,
       fee,
       memo
     );

     // Check for errors
     if (result.code !== 0) {
       throw new Error(`Transaction failed: ${result.rawLog}`);
     }

     return result.transactionHash;
   }
   ```

3. **Handle RPC endpoint injection**
   - **Option A (Recommended):** Pass RPC as method parameter
     - Changes interface signature
     - Most flexible, no hidden dependencies
   - **Option B:** Import chain store directly
     - Creates tight coupling
     - Adapters become aware of app state
   - **Option C:** Dependency injection via constructor
     - Clean architecture
     - Requires refactoring wallet initialization

**Chosen Approach: Option A (Pass RPC)**
- Keeps adapters stateless
- Clear dependency in method signature
- Easy to test

**Updated Interface:**
```typescript
signAndBroadcast(
  rpcEndpoint: string,
  chainId: string,
  messages: readonly EncodeObject[],
  fee: StdFee,
  memo?: string
): Promise<string>;
```

**Edge Cases:**
- [ ] Keplr not enabled for chain - call `enable()` first
- [ ] User rejects transaction - catch and rethrow with user-friendly message
- [ ] RPC endpoint unreachable - timeout and retry logic
- [ ] Insufficient funds - parse error and display balance needed
- [ ] Invalid messages - validate before signing
- [ ] Transaction timeout - poll for confirmation
- [ ] Mempool full - retry with higher gas
- [ ] Chain halt - detect and inform user

**Testing Requirements:**
- Unit tests with mock Keplr object
- Integration tests with testnet
- Error handling tests for all edge cases
- Gas estimation validation

**Estimated Effort:** 4-6 hours

---

### **ISSUE P1-1: Add Missing JSDoc Documentation**

**Priority:** P1 (High)
**Files Affected:**
- `src/lib/utils/validation.ts`
- `src/lib/utils/format.ts`
- `src/lib/wallet/keplr.ts`
- `src/lib/wallet/leap.ts`
- `src/lib/wallet/index.ts`
- `src/lib/chains/evmd/params.ts`

**Problem:** Missing comprehensive JSDoc comments for TypeDoc generation

**Implementation Steps:**

1. **Add fileoverview to all files**
   ```typescript
   /**
    * @fileoverview [Module purpose and description]
    * @module [module-name]
    */
   ```

2. **Document all exported functions**
   - Add @param for all parameters
   - Add @returns for return values
   - Add @throws for error conditions
   - Add @example for complex functions
   - Add @see for related functions

3. **Document all interfaces and types**
   - Add @interface or @typedef tags
   - Document each property
   - Add usage examples

4. **Document Zod schemas**
   ```typescript
   /**
    * Zod schema for validating Cosmos bech32 addresses.
    * Optionally validates against a specific prefix.
    *
    * @param {string} [prefix] - Optional bech32 prefix to validate against
    * @returns {z.ZodString} Zod schema for address validation
    * @example
    * const schema = cosmosAddressSchema('evmos');
    * schema.parse('evmos1abc...'); // Valid
    * schema.parse('cosmos1abc...'); // Throws validation error
    */
   ```

5. **Document wallet adapter classes**
   - Class-level documentation
   - Method documentation
   - Usage examples
   - Error conditions

**Pattern to Follow:**
```typescript
/**
 * Brief one-line description.
 *
 * Longer description explaining what it does, when to use it,
 * and any important considerations.
 *
 * @param {Type} paramName - Parameter description
 * @param {Type} [optionalParam] - Optional parameter description
 * @returns {ReturnType} What the function returns
 * @throws {ErrorType} When this error is thrown
 * @example
 * // Usage example
 * const result = functionName(arg1, arg2);
 * @see relatedFunction
 */
```

**Estimated Effort:** 6-8 hours

---

### **ISSUE P1-2: Implement Account Change Handlers**

**Priority:** P1 (High)
**Files Affected:**
- `src/lib/wallet/types.ts`
- `src/lib/wallet/keplr.ts`
- `src/lib/wallet/leap.ts`
- `src/store/wallet.ts` (likely needs update)

**Problem:** Incomplete event handlers don't update UI when user switches accounts

**Current Implementation:**
```typescript
onAccountChange(callback: (accounts: readonly AccountData[]) => void): void {
  window.addEventListener('keplr_keystorechange', async () => {
    // Re-fetch accounts when keystore changes
    // This requires chainId which should come from context
  });
}
```

**Implementation Steps:**

1. **Update WalletAdapter interface**
   ```typescript
   interface WalletAdapter {
     // ... existing methods

     /**
      * Subscribe to account changes.
      * @param chainId - The chain ID to monitor
      * @param callback - Function called when account changes
      * @returns Cleanup function to unsubscribe
      */
     onAccountChange(
       chainId: string,
       callback: (account: AccountData | null) => void
     ): () => void;
   }
   ```

2. **Implement in Keplr adapter**
   ```typescript
   onAccountChange(
     chainId: string,
     callback: (account: AccountData | null) => void
   ): () => void {
     if (!this.keplr) {
       return () => {}; // No-op cleanup
     }

     const handler = async () => {
       try {
         // Re-enable to get updated permissions
         await this.keplr!.enable(chainId);

         // Get new account
         const offlineSigner = this.keplr!.getOfflineSigner(chainId);
         const accounts = await offlineSigner.getAccounts();

         if (accounts.length > 0) {
           callback(accounts[0]);
         } else {
           callback(null);
         }
       } catch (error) {
         console.error('Account change handler error:', error);
         callback(null);
       }
     };

     window.addEventListener('keplr_keystorechange', handler);

     // Return cleanup function
     return () => {
       window.removeEventListener('keplr_keystorechange', handler);
     };
   }
   ```

3. **Integrate with wallet store**
   ```typescript
   // In wallet store or component
   useEffect(() => {
     if (wallet && chainId) {
       const cleanup = wallet.onAccountChange(chainId, (account) => {
         if (account) {
           // Update store with new account
           setAccount(account);
         } else {
           // Account disconnected
           disconnect();
         }
       });

       return cleanup;
     }
   }, [wallet, chainId]);
   ```

4. **Implement for Leap adapter** (same pattern)

**Edge Cases:**
- [ ] User locks wallet - callback should handle null
- [ ] User removes permissions - handle error gracefully
- [ ] Multiple chains active - need per-chain subscriptions
- [ ] Rapid account switching - debounce if needed
- [ ] Event fires but account unchanged - skip update
- [ ] Component unmounts - cleanup must run
- [ ] Wallet disconnects mid-session - handle gracefully

**Testing Requirements:**
- Test account switching in wallet
- Test wallet lock/unlock
- Test permission removal
- Test memory leaks (cleanup)
- Test multiple simultaneous handlers

**Estimated Effort:** 3-4 hours

---

### **ISSUE P1-3: Fix Type Safety Issues**

**Priority:** P1 (High)
**Files Affected:**
- `src/lib/wallet/types.ts`
- `src/lib/wallet/keplr.ts`
- `src/lib/wallet/leap.ts`
- All files using wallet adapters

**Problem:** Using `any` types for critical transaction data

**Current:**
```typescript
signAndBroadcast(
  chainId: string,
  messages: any[],     // ❌ Weak
  fee: any,            // ❌ Weak
  memo?: string
): Promise<string>
```

**Target:**
```typescript
signAndBroadcast(
  rpcEndpoint: string,
  chainId: string,
  messages: readonly EncodeObject[],  // ✅ Strong
  fee: StdFee,                        // ✅ Strong
  memo?: string
): Promise<string>
```

**Implementation Steps:**

1. **Import proper types in types.ts**
   ```typescript
   import type { EncodeObject } from '@cosmjs/proto-signing';
   import type { StdFee } from '@cosmjs/stargate';
   ```

2. **Update interface**
   - Already covered in P0-1 implementation

3. **Update all call sites**
   - Search codebase for `wallet.signAndBroadcast` calls
   - Update to use proper types
   - Ensure messages have correct structure:
     ```typescript
     const messages: EncodeObject[] = [{
       typeUrl: '/cosmos.gov.v1.MsgSubmitProposal',
       value: { /* properly typed value */ }
     }];
     ```

4. **Add type guards where needed**
   ```typescript
   function isEncodeObject(obj: any): obj is EncodeObject {
     return (
       typeof obj === 'object' &&
       obj !== null &&
       typeof obj.typeUrl === 'string' &&
       'value' in obj
     );
   }
   ```

5. **Update proposal submission code**
   - Governance proposal submission needs to construct proper EncodeObject[]
   - Currently might be using plain objects

**Files to Update:**
- Search for: `signAndBroadcast(`
- Update all call sites with proper types

**Edge Cases:**
- [ ] Dynamic message construction - ensure type safety maintained
- [ ] Message value encoding - must match typeUrl
- [ ] Fee calculation - StdFee structure must be valid
- [ ] Gas estimation - ensure numbers not strings

**Testing Requirements:**
- Type-check entire codebase
- Ensure no implicit any
- Runtime validation for message structure
- Test with various message types

**Estimated Effort:** 2-3 hours (depends on call site count)

---

### **ISSUE P2-1: Implement Transaction Module**

**Priority:** P2 (Medium)
**Location:** `src/lib/tx/`

**Problem:** Empty directory, missing transaction utilities

**Implementation Steps:**

1. **Create `src/lib/tx/builder.ts`**
   ```typescript
   /**
    * @fileoverview Transaction builder utilities
    * Helpers for constructing Cosmos SDK transactions with proper structure.
    */

   import type { EncodeObject } from '@cosmjs/proto-signing';
   import type { StdFee, Coin } from '@cosmjs/stargate';

   /**
    * Build a standard transaction fee object.
    */
   export function buildFee(
     gasLimit: number,
     gasPrice: string,
     payer?: string,
     granter?: string
   ): StdFee {
     // Parse gas price (e.g., "0.025uatom")
     const match = gasPrice.match(/^([\d.]+)(.+)$/);
     if (!match) {
       throw new Error(`Invalid gas price format: ${gasPrice}`);
     }

     const [, price, denom] = match;
     const amount = Math.ceil(gasLimit * parseFloat(price)).toString();

     return {
       amount: [{ amount, denom }],
       gas: gasLimit.toString(),
       payer,
       granter,
     };
   }

   /**
    * Estimate gas for messages.
    */
   export function estimateGas(messages: readonly EncodeObject[]): number {
     // Base gas per transaction
     let gas = 100_000;

     // Add gas per message
     gas += messages.length * 50_000;

     // Add gas based on message complexity
     messages.forEach(msg => {
       const size = JSON.stringify(msg.value).length;
       gas += Math.ceil(size / 100) * 1000;
     });

     // Add 20% buffer
     return Math.ceil(gas * 1.2);
   }
   ```

2. **Create `src/lib/tx/simulation.ts`**
   ```typescript
   /**
    * @fileoverview Transaction simulation utilities
    * Simulate transactions before broadcasting to estimate gas and validate.
    */

   import { StargateClient } from '@cosmjs/stargate';
   import type { EncodeObject } from '@cosmjs/proto-signing';

   export interface SimulationResult {
     success: boolean;
     gasUsed: number;
     gasWanted: number;
     error?: string;
   }

   /**
    * Simulate transaction to estimate gas.
    */
   export async function simulateTransaction(
     rpcEndpoint: string,
     signerAddress: string,
     messages: readonly EncodeObject[],
     memo?: string
   ): Promise<SimulationResult> {
     const client = await StargateClient.connect(rpcEndpoint);

     try {
       // This requires access to simulate endpoint
       // Implementation depends on CosmJS version
       throw new Error('Simulation not yet implemented - needs CosmJS simulate');
     } catch (error) {
       return {
         success: false,
         gasUsed: 0,
         gasWanted: 0,
         error: error instanceof Error ? error.message : 'Unknown error',
       };
     }
   }
   ```

3. **Create `src/lib/tx/memo.ts`**
   ```typescript
   /**
    * @fileoverview Memo formatting utilities
    */

   const MAX_MEMO_LENGTH = 256;

   /**
    * Validate and sanitize transaction memo.
    */
   export function formatMemo(memo: string): string {
     // Remove non-printable characters
     const cleaned = memo.replace(/[^\x20-\x7E]/g, '');

     // Truncate if too long
     if (cleaned.length > MAX_MEMO_LENGTH) {
       return cleaned.slice(0, MAX_MEMO_LENGTH - 3) + '...';
     }

     return cleaned;
   }

   /**
    * Create a memo with application identifier.
    */
   export function createAppMemo(action: string, metadata?: Record<string, any>): string {
     const base = `Chain Orchestrator: ${action}`;

     if (metadata) {
       const metaStr = JSON.stringify(metadata);
       const remaining = MAX_MEMO_LENGTH - base.length - 3;

       if (metaStr.length <= remaining) {
         return `${base} | ${metaStr}`;
       }
     }

     return base;
   }
   ```

4. **Create `src/lib/tx/index.ts`**
   ```typescript
   export * from './builder';
   export * from './simulation';
   export * from './memo';
   ```

**Estimated Effort:** 4-5 hours

---

### **ISSUE P2-2: Add Transaction History Module**

**Priority:** P2 (Medium)
**New Files:**
- `src/store/transaction.ts` (may already exist)
- `src/lib/tx/history.ts`

**Problem:** No audit trail for submitted transactions

**Implementation Steps:**

1. **Define transaction history types**
   ```typescript
   export interface TransactionRecord {
     hash: string;
     chainId: string;
     timestamp: number;
     type: 'governance' | 'send' | 'delegate' | 'vote' | 'other';
     status: 'pending' | 'success' | 'failed';
     messages: EncodeObject[];
     fee: StdFee;
     memo?: string;
     error?: string;
     blockHeight?: number;
   }
   ```

2. **Create history store**
   ```typescript
   interface TransactionHistoryState {
     transactions: TransactionRecord[];
     addTransaction: (tx: TransactionRecord) => void;
     updateTransaction: (hash: string, updates: Partial<TransactionRecord>) => void;
     getTransaction: (hash: string) => TransactionRecord | undefined;
     getTransactionsByChain: (chainId: string) => TransactionRecord[];
     clearHistory: () => void;
     exportHistory: () => string;
   }
   ```

3. **Add persistence**
   - Use zustand persist middleware
   - Store in localStorage
   - Limit to last 100 transactions

4. **Create history component**
   - Table view of transactions
   - Filter by chain, type, status
   - Link to explorer
   - Export functionality

5. **Integrate with wallet**
   - After successful broadcast, add to history
   - Poll for status updates
   - Update when confirmed

**Estimated Effort:** 6-8 hours

---

### **ISSUE P2-3: Create Template System**

**Priority:** P2 (Medium)
**New Files:**
- `src/store/template.ts`
- `src/components/governance/TemplateManager.tsx`

**Problem:** Can't save/reuse proposal configurations

**Implementation Steps:**

1. **Define template types**
   ```typescript
   export interface ProposalTemplate {
     id: string;
     name: string;
     description: string;
     proposalType: ProposalType;
     configuration: any; // Type varies by proposal type
     createdAt: number;
     updatedAt: number;
     useCount: number;
   }
   ```

2. **Create template store**
   ```typescript
   interface TemplateState {
     templates: ProposalTemplate[];
     addTemplate: (template: Omit<ProposalTemplate, 'id' | 'createdAt' | 'useCount'>) => void;
     updateTemplate: (id: string, updates: Partial<ProposalTemplate>) => void;
     deleteTemplate: (id: string) => void;
     getTemplate: (id: string) => ProposalTemplate | undefined;
     getTemplatesByType: (type: string) => ProposalTemplate[];
     incrementUseCount: (id: string) => void;
     exportTemplates: () => string;
     importTemplates: (json: string) => void;
   }
   ```

3. **Add UI components**
   - Template library view
   - Save current proposal as template
   - Load template into wizard
   - Template preview
   - Import/export buttons

4. **Add default templates**
   - Common parameter changes
   - Standard software upgrade
   - Example text proposals

**Estimated Effort:** 8-10 hours

---

### **ISSUE P2-4: Refactor Address Formatting**

**Priority:** P2 (Medium)
**Files Affected:**
- `src/lib/governance/proposalGenerator.ts`

**Problem:** Duplicate address shortening logic

**Implementation Steps:**

1. **Update proposalGenerator.ts imports**
   ```typescript
   import { shortenAddress } from '@/lib/utils/address';
   ```

2. **Replace inline shortening**
   - Find: `recipient.length > 20 ? \`\${recipient.slice(0, 10)}...\${recipient.slice(-8)}\` : recipient`
   - Replace with: `shortenAddress(recipient, 10, 8)`

3. **Standardize across codebase**
   - Search for address shortening patterns
   - Replace all with utility function
   - Ensure consistent character counts

**Estimated Effort:** 1 hour

---

### **ISSUE P2-5: Add suggestChain to Interface**

**Priority:** P2 (Medium)
**Files Affected:**
- `src/lib/wallet/types.ts`
- `src/lib/wallet/keplr.ts`
- `src/lib/wallet/leap.ts`

**Problem:** Method exists but not in interface

**Implementation Steps:**

1. **Define ChainInfo type**
   ```typescript
   import type { ChainInfo } from '@keplr-wallet/types';
   ```

2. **Add to interface**
   ```typescript
   interface WalletAdapter {
     // ... existing methods

     /**
      * Suggest adding a new chain to the wallet.
      * @param chainInfo - Chain configuration
      */
     suggestChain?(chainInfo: ChainInfo): Promise<void>;
   }
   ```

3. **Update implementations to match**
   - Already implemented, just need interface update

4. **Add UI for custom chains**
   - Form to input chain details
   - Call suggestChain when adding
   - Handle user rejection

**Estimated Effort:** 2 hours

---

### **ISSUE P3-1: Code Cleanup**

**Priority:** P3 (Low)
**Files Affected:**
- `src/lib/utils/format.ts:8`

**Problem:** Redundant BigInt conversion

**Fix:**
```typescript
// Before
const num = typeof amount === 'string' ? BigInt(amount) : BigInt(amount);

// After
const num = BigInt(amount);
```

**Estimated Effort:** 5 minutes

---

## PHASE 2: PLAN COMBINATION & OPTIMIZATION

### **Combined Plan Analysis**

After reviewing all individual plans, I've identified these combination opportunities:

#### **COMBINATION 1: Type Safety + Wallet Implementation**
**Issues:** P0-1, P1-3
**Reasoning:** These must be done together since fixing signAndBroadcast requires proper types
**Combined Effort:** 4-6 hours (no savings, must be sequential)
**Sequence:**
1. Update types first (P1-3)
2. Then implement signAndBroadcast (P0-1)

#### **COMBINATION 2: Documentation Pass**
**Issues:** P1-1 (All JSDoc additions)
**Reasoning:** Can be done in single documentation sweep after all code changes
**Combined Effort:** 6-8 hours
**Sequence:** Do LAST after all other changes complete

#### **COMBINATION 3: Transaction Infrastructure**
**Issues:** P2-1 (tx module), P2-2 (history), P0-1 (wallet)
**Reasoning:** History needs tx module utilities, wallet needs both
**Combined Effort:** 12-14 hours
**Sequence:**
1. Build tx module utilities first
2. Implement wallet with tx utilities
3. Add history tracking to wallet calls

#### **COMBINATION 4: Minor Fixes**
**Issues:** P2-4 (address formatting), P3-1 (code cleanup)
**Reasoning:** Quick wins, can batch together
**Combined Effort:** 1.5 hours
**Sequence:** Do together in single pass

#### **STANDALONE ITEMS:**
- P1-2: Account handlers (depends on wallet being functional)
- P2-3: Templates (UI feature, independent)
- P2-5: suggestChain (small interface addition)

### **Optimized Execution Order**

Based on dependencies and efficiency:

1. **Phase 1: Core Functionality** (P0 + Critical P1)
   - P1-3: Fix type safety → 2-3 hours
   - P0-1: Implement signAndBroadcast → 4-6 hours
   - **Total: 6-9 hours**

2. **Phase 2: Transaction Infrastructure** (P2 dependencies)
   - P2-1: Build tx module → 4-5 hours
   - P2-2: Add transaction history → 6-8 hours
   - **Total: 10-13 hours**

3. **Phase 3: Enhanced UX** (P1 remaining)
   - P1-2: Account change handlers → 3-4 hours
   - **Total: 3-4 hours**

4. **Phase 4: Feature Additions** (P2 remaining)
   - P2-3: Template system → 8-10 hours
   - P2-5: suggestChain interface → 2 hours
   - **Total: 10-12 hours**

5. **Phase 5: Polish** (P2 cleanup + P3)
   - P2-4: Refactor address formatting → 1 hour
   - P3-1: Code cleanup → 5 minutes
   - **Total: ~1 hour**

6. **Phase 6: Documentation** (P1 doc pass)
   - P1-1: Complete JSDoc for all changes → 6-8 hours
   - **Total: 6-8 hours**

**Total Estimated Effort: 36-47 hours (5-6 working days)**

---

## PHASE 3: EDGE CASE REVIEW

### **Cross-Cutting Edge Cases**

#### **Error Handling Patterns**
- [ ] Network failures (RPC unreachable)
- [ ] Wallet user rejection
- [ ] Insufficient funds
- [ ] Chain halt/congestion
- [ ] Invalid chain configuration
- [ ] Expired/invalid sessions
- [ ] Rate limiting

#### **State Management**
- [ ] Component unmount during async operations
- [ ] Stale closures in event handlers
- [ ] Race conditions in state updates
- [ ] localStorage quota exceeded
- [ ] Invalid persisted state on load
- [ ] Multiple wallet connections simultaneously

#### **Type Safety**
- [ ] Runtime validation of external data (RPC responses)
- [ ] Message value encoding mismatches
- [ ] BigInt serialization issues
- [ ] ChainId format variations

#### **User Experience**
- [ ] Loading states for all async operations
- [ ] Error messages are user-friendly
- [ ] Success confirmations with links
- [ ] Undo/cancel for pending operations
- [ ] Optimistic UI updates

### **Issue-Specific Edge Cases Added**

#### **P0-1: signAndBroadcast**
Additional edge cases identified:
- [ ] Transaction broadcast timeout → Add 30s timeout with retry
- [ ] Nonce/sequence mismatch → Refetch account before retry
- [ ] Transaction stuck in mempool → Allow manual gas increase
- [ ] Chain-specific message formats → Validate per chain
- [ ] Multi-sig accounts → Different flow entirely

#### **P1-2: Account Change Handlers**
Additional edge cases:
- [ ] Handler called before wallet fully initialized → Add ready check
- [ ] Multiple rapid account changes → Debounce with 500ms delay
- [ ] Account change during pending transaction → Cancel or wait?
- [ ] Event listener memory leaks → Verify cleanup in all scenarios

#### **P2-2: Transaction History**
Additional edge cases:
- [ ] Very long transaction list → Pagination needed
- [ ] Corrupted localStorage data → Graceful fallback
- [ ] Transaction on wrong chain → Clear indication
- [ ] Pending transaction after page reload → Re-check status

---

## PHASE 4: FINAL SEQUENCE REVIEW

### **Updated Optimal Sequence**

After edge case analysis, adjusted sequence:

#### **STAGE 1: Foundation (Day 1)**
1. P3-1: Code cleanup (5 min)
2. P1-3: Type safety fixes (2-3 hours)
3. P2-4: Address formatting refactor (1 hour)
4. P2-1: Transaction utilities (4-5 hours)

**Why this order:**
- Quick wins first (momentum)
- Type safety before implementation
- Tx utilities before they're needed
- Clean foundation for core features

**Deliverable:** Clean, type-safe codebase with utilities ready

---

#### **STAGE 2: Core Functionality (Day 2)**
5. P0-1: Implement signAndBroadcast (4-6 hours)
   - With retry logic
   - With timeout handling
   - With proper error messages
6. Manual testing of proposal submission

**Why this order:**
- Unblocks entire application
- Can test end-to-end flow
- Proves architecture works

**Deliverable:** Working proposal submission

---

#### **STAGE 3: Enhanced Core (Day 3)**
7. P2-2: Transaction history (6-8 hours)
   - Integrate with wallet calls
   - Add persistence
   - Build basic UI

**Why this order:**
- Adds audit trail immediately
- Uses fresh wallet implementation
- Provides debugging visibility

**Deliverable:** Transaction tracking

---

#### **STAGE 4: User Experience (Day 4)**
8. P1-2: Account change handlers (3-4 hours)
9. P2-5: suggestChain interface (2 hours)
10. Testing and bug fixes (3-4 hours)

**Why this order:**
- UX improvements on working foundation
- Time for testing/iteration
- Interface additions are low risk

**Deliverable:** Polished UX

---

#### **STAGE 5: Power Features (Day 5)**
11. P2-3: Template system (8-10 hours)

**Why this order:**
- Complex feature needs stable base
- Can be done independently
- Non-blocking feature

**Deliverable:** Template functionality

---

#### **STAGE 6: Documentation (Day 6)**
12. P1-1: Complete JSDoc pass (6-8 hours)
13. Regenerate TypeDoc
14. Final review and testing

**Why this order:**
- Document final state of code
- Includes all changes made
- Professional finish

**Deliverable:** Complete documentation

---

## SUCCESS CRITERIA

### **Phase 1 Success (Core)**
- [ ] User can submit governance proposal via Keplr
- [ ] User can submit governance proposal via Leap
- [ ] Transaction succeeds or fails with clear error
- [ ] All types are properly defined (no `any`)
- [ ] No TypeScript errors

### **Phase 2 Success (Infrastructure)**
- [ ] Transaction utilities work correctly
- [ ] Gas estimation is reasonable
- [ ] Transaction history saves and persists
- [ ] History UI shows transactions
- [ ] Can export transaction history

### **Phase 3 Success (UX)**
- [ ] UI updates when account changes
- [ ] Memory leaks verified fixed
- [ ] Event handlers clean up properly
- [ ] Can add custom chains

### **Phase 4 Success (Features)**
- [ ] Can save proposal as template
- [ ] Can load template
- [ ] Can import/export templates
- [ ] Default templates provided

### **Phase 5 Success (Polish)**
- [ ] No duplicate code
- [ ] Consistent patterns throughout
- [ ] Clean code review

### **Phase 6 Success (Documentation)**
- [ ] TypeDoc generates without errors
- [ ] All public APIs documented
- [ ] Examples provided for complex functions
- [ ] Documentation is accurate

---

## ROLLBACK PLAN

If critical issues discovered during implementation:

1. **P0-1 fails:** Revert wallet changes, create simplified version
2. **Integration issues:** Use feature flags to disable problematic features
3. **Performance problems:** Optimize or defer non-critical features
4. **Type errors:** Relax types temporarily, fix properly later

Each phase has git commits, easy to revert individual changes.

---

## NEXT STEP: EXECUTION

Ready to begin implementation following this plan?

**Recommended approach:**
1. Create feature branch: `feat/code-review-fixes`
2. Work through stages sequentially
3. Commit after each completed issue
4. Push regularly for backup
5. Final review before merging to main

Shall I proceed with Stage 1 (Foundation)?
