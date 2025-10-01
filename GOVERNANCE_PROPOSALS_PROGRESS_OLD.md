# Governance Proposals Implementation Progress

## Project Goal
Implement comprehensive support for all Cosmos SDK governance proposal types with proper validation, JSON structure support, and user-friendly forms.

## Research Summary

### Cosmos SDK Governance Proposal Types Discovered

1. **Software Upgrade Proposal** (`/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade`)
   - Required fields: `authority`, `plan` (name, height, info)
   - Info field contains JSON with binary URLs and checksums
   - Example from Cosmos Hub proposal #1004 analyzed

2. **Community Pool Spend** (`/cosmos.distribution.v1beta1.MsgCommunityPoolSpend`)
   - Required fields: `authority`, `recipient`, `amount`
   - Amount is array of coins with denom and amount

3. **Cancel Upgrade** (`/cosmos.upgrade.v1beta1.MsgCancelUpgrade`)
   - Simple message with just `authority` field
   - Used to cancel pending software upgrades

4. **IBC Client Update** (`/ibc.core.client.v1.MsgUpdateClient` or similar)
   - Used for recovering frozen/expired IBC clients
   - Required fields: `subjectClientId`, `substituteClientId`

5. **Custom Messages** (any message type)
   - Flexible support for any `/cosmos.*` or other SDK message types
   - Requires proper message structure with `@type` field

6. **Parameter Change** (module-specific)
   - EVMD modules: VM, ERC20, FeeMarket
   - Uses module-specific message types

7. **Text/Signaling Proposals**
   - Non-binding governance votes
   - No messages, just metadata

## Completed Tasks ✅

### 1. Research & Analysis
- [x] Deep dive into Cosmos SDK governance proposal types
- [x] Analyzed Mintscan example (Cosmos Hub proposal #1004)
- [x] Identified message structures for all common proposal types
- [x] Researched best practices and validation requirements

### 2. Type System Updates
- [x] Added `CLIENT_UPDATE` and `CUSTOM_MESSAGE` to `PROPOSAL_CATEGORIES`
- [x] Added proposal type definitions in `src/lib/governance/types.ts`:
  - `CLIENT_UPDATE` - IBC client update proposals
  - `CUSTOM_MESSAGE` - Advanced custom message proposals
- [x] Created TypeScript interfaces:
  - `ClientUpdateProposal`
  - `CustomMessageProposal`

### 3. Form Components Created
- [x] **SoftwareUpgradeForm** (`src/components/governance/SoftwareUpgradeForm.tsx`)
  - Enhanced with JSON validation for `info` field
  - Added regex validation for upgrade name
  - Updated placeholder with real-world example from Cosmos Hub
  - Improved descriptions and best practices

- [x] **ClientUpdateForm** (`src/components/governance/ClientUpdateForm.tsx`)
  - Form for IBC light client updates
  - Validates client ID format (07-tendermint-\d+)
  - Warning alerts about advanced usage
  - Requirements checklist

- [x] **CustomMessageForm** (`src/components/governance/CustomMessageForm.tsx`)
  - Accepts JSON array of any Cosmos SDK messages
  - Real-time message preview showing detected message types
  - Validates @type field presence
  - Example common message types listed
  - Advanced user warnings

### 4. Component Integration (Partial)
- [x] Imported new forms into ProposalWizard
- [x] Added state management for new proposal types:
  - `clientUpdateData`
  - `customMessageData`

## Remaining Tasks 🚧

### 1. Complete ProposalWizard Integration
- [ ] Update `canProceedFromConfigure()` to handle CLIENT_UPDATE and CUSTOM_MESSAGE
- [ ] Add CLIENT_UPDATE form rendering in configure step
- [ ] Add CUSTOM_MESSAGE form rendering in configure step
- [ ] Update `buildProposal()` to generate messages for new types:
  - CLIENT_UPDATE: `/ibc.core.client.v1.MsgRecoverClient` or appropriate message
  - CUSTOM_MESSAGE: Use provided messages array

### 2. Message Building Logic
- [ ] Implement CLIENT_UPDATE message builder:
  ```typescript
  {
    '@type': '/ibc.core.client.v1.MsgRecoverClient',
    authority: GOVERNANCE_AUTHORITY,
    subject_client_id: clientUpdateData.subjectClientId,
    substitute_client_id: clientUpdateData.substituteClientId,
  }
  ```
- [ ] Implement CUSTOM_MESSAGE message builder:
  - Parse messages from customMessageData
  - Ensure each message has proper structure

### 3. Testing & Validation
- [ ] Test SOFTWARE_UPGRADE proposal creation end-to-end
  - Verify JSON validation works
  - Test with real Cosmos Hub example
  - Validate generated proposal JSON structure

- [ ] Test CLIENT_UPDATE proposal creation
  - Verify client ID validation
  - Test proposal JSON generation

- [ ] Test CUSTOM_MESSAGE proposal creation
  - Test with various message types
  - Verify message preview functionality
  - Validate JSON parsing

- [ ] Test all existing proposal types still work:
  - Parameter Change (VM, ERC20, FeeMarket, Multi-Module)
  - Text/Signaling
  - Community Pool Spend
  - Cancel Upgrade

### 4. UI/UX Improvements
- [ ] Add "Load Example" buttons to forms with pre-filled realistic data
- [ ] Add JSON formatter/prettifier to CustomMessageForm
- [ ] Consider adding Monaco editor for better JSON editing experience
- [ ] Add proposal validation summary before submission
- [ ] Add estimated gas calculation

### 5. Documentation
- [ ] Update CLAUDE.md with new proposal types
- [ ] Add inline code documentation for new message builders
- [ ] Create examples directory with sample proposals for each type

### 6. Advanced Features (Future)
- [ ] Query chain for current block height (for upgrade proposals)
- [ ] Query IBC client states (for client update proposals)
- [ ] Validate recipient addresses against chain bech32 prefix
- [ ] Add proposal simulation/dry-run before submission
- [ ] Save draft proposals to localStorage
- [ ] Import proposal JSON from file
- [ ] Export proposal JSON with filename

## Files Modified

### Created
- `src/components/governance/ClientUpdateForm.tsx` - New IBC client update form
- `src/components/governance/CustomMessageForm.tsx` - New custom message form

### Updated
- `src/lib/governance/types.ts` - Added new proposal categories and interfaces
- `src/components/governance/SoftwareUpgradeForm.tsx` - Enhanced validation and examples
- `src/components/governance/ProposalWizard.tsx` - Partial integration (imports and state)

## Key Learnings

1. **Software Upgrade Info Field**: Must be valid JSON containing binary URLs with SHA256 checksums
   - Format: `{"binaries": {"darwin/amd64": "url?checksum=sha256:hash", ...}}`

2. **IBC Client Updates**: Advanced feature requiring careful validation
   - Both clients must exist and track same counterparty chain
   - Substitute client must be active

3. **Custom Messages**: Powerful but dangerous - requires advanced knowledge
   - Each message must have `@type` field with full protobuf message type URL
   - Authority field typically required for gov proposals

4. **Governance Authority**: Cosmos Hub uses `cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn`
   - This is the governance module account that has authority to execute proposals

## Next Steps

1. **Immediate**: Complete ProposalWizard integration for new proposal types
2. **Priority**: Test all proposal types with dev server
3. **Important**: Add message builders for CLIENT_UPDATE and CUSTOM_MESSAGE
4. **Nice-to-have**: UI improvements and example data loading

## References

- Cosmos Hub Proposal #1004: https://www.mintscan.io/cosmos/proposals/1004
- Cosmos SDK Gov Module: https://docs.cosmos.network/main/build/modules/gov
- Cosmos SDK Upgrade Module: https://docs.cosmos.network/main/build/modules/upgrade
- Cosmos Hub Documentation: https://hub.cosmos.network/main/governance/
