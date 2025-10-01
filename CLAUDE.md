# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chain Orchestrator is a React-based web application for interacting with Cosmos SDK blockchains, specifically focused on EVMD (EVM-compatible Cosmos chain) module parameter management, governance proposals, and transaction building. Built with Vite, React 19, TypeScript, and Tailwind CSS.

## Development Commands

```bash
# Development server (default port 5173)
npm run dev

# Type-check and build production bundle
npm run build

# Preview production build locally
npm run preview

# Lint with ESLint
npm run lint
```

## Architecture Overview

### State Management Pattern

The application uses **Zustand** for global state management with three primary stores:

1. **Wallet Store** (`src/store/wallet.ts`) - Wallet connection state, account data, persisted to localStorage
2. **Chain Store** (`src/store/chain.ts`) - Chain configurations, selected chain, persisted to localStorage
3. **Transaction Store** (`src/store/transaction.ts`) - Transaction history and current transaction state (not persisted)

All stores use TypeScript for type safety. Wallet and chain stores use `zustand/middleware/persist` for localStorage persistence.

### Component Architecture

- **UI Layer**: 34+ shadcn/ui components in `src/components/ui/` - DO NOT modify these, they are managed by shadcn CLI
- **Custom Components**: Domain-specific components in `src/components/custom/` for blockchain UIs (AddressInput, CoinInput, PrecompileSelector, etc.)
- **Feature Components**: Organized by domain:
  - `src/components/governance/` - Governance proposal creation and voting UIs
  - `src/components/layout/` - Application shell (Header, Sidebar, MainLayout)

### Routing Structure

React Router with layout-based routing:
- `/` - Dashboard
- `/governance/create` - Proposal wizard
- `/governance/proposals` - Proposal list
- `/modules/{vm,erc20,feemarket}` - Module parameter views
- `/transactions/send` - Transaction builder

All routes nested under `MainLayout` component which provides consistent header/sidebar.

### Wallet Integration Pattern

Wallet adapters follow a common interface defined in `src/lib/wallet/types.ts`:
- `connect()` - Connect and get account
- `disconnect()` - Clean up connection
- `getSigner()` - Get CosmJS OfflineSigner
- `signAndBroadcast()` - Sign and broadcast transactions
- `isAvailable()` - Check if wallet extension is installed

Implementations in `src/lib/wallet/{keplr,leap,ledger}.ts` follow this interface.

### EVMD Parameter Management

Parameter schemas in `src/lib/chains/evmd/params.ts` are **AUTO-GENERATED** from documentation:
- Each parameter includes: type, default, validation (Zod), description, governanceOnly flag
- Three modules: VM (6 params), ERC20 (2 params), Feemarket (7 params)
- Export governance message types and authority address
- **DO NOT manually edit** - regenerate using `scripts/parse-evmd-data.ts` if schema changes

## Key Technical Patterns

### Form Handling
- Use `react-hook-form` with `@hookform/resolvers/zod` for validation
- Import Zod schemas from parameter definitions: `evmdVmParams.evm_denom.validation`
- Use shadcn `Form` components for consistent styling

### Transaction Building
- Build messages with `@cosmjs/stargate` types
- Message types exported from `src/lib/chains/evmd/params.ts` as `MSG_TYPES`
- Use `GOVERNANCE_AUTHORITY` constant for governance proposals
- Transaction flow: Build → Sign (via wallet) → Broadcast → Update store

### Chain Configuration
- Default chains in `src/store/chain.ts` (Cosmos Hub, Evmos)
- Chain configs include: chainId, RPC/REST endpoints, bech32 prefix, coin denom/decimals, gas price
- Selected chain persisted to localStorage

### Address Validation
- Utility functions in `src/lib/utils/address.ts`
- Support both Cosmos (bech32) and EVM (0x-prefixed hex) formats
- Validate against chain's bech32 prefix

## Important Files & Directories

### Do Not Modify
- `src/components/ui/*` - Managed by shadcn CLI
- `src/lib/chains/evmd/params.ts` - Auto-generated parameter schemas
- `components.json` - shadcn configuration
- `.gitignore`, `eslint.config.js`, `postcss.config.js` - Build tooling configs

### Configuration Files
- `vite.config.ts` - Vite configuration with `@` path alias to `./src`
- `tailwind.config.js` - Tailwind configuration with CSS variables for theming
- `tsconfig.json` - TypeScript configuration (references app and node configs)

### Key Source Files
- `src/App.tsx` - Root component with routing and QueryClient setup
- `src/main.tsx` - Application entry point
- `src/index.css` - Global styles with Tailwind directives and CSS custom properties

## Dependencies & Libraries

### Core Stack
- **React 19** - Latest React with new features
- **TypeScript 5.8** - Type safety
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS

### Blockchain Libraries
- **@cosmjs/stargate** - Cosmos SDK client (queries, transactions)
- **@cosmjs/proto-signing** - Transaction signing
- **@keplr-wallet/types** - Keplr wallet type definitions
- **bech32** - Address encoding/decoding

### State & Data
- **zustand** - Lightweight state management
- **@tanstack/react-query** - Async state management, caching, refetching
- **react-hook-form** - Form state management
- **zod** - Schema validation

### UI Utilities
- **@monaco-editor/react** - Code editor for JSON/CLI preview
- **react-json-view-lite** - JSON visualization
- **@dnd-kit/core** - Drag and drop for batch transaction builder
- **sonner** - Toast notifications (via `src/components/ui/sonner.tsx`)

## Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx` under MainLayout's nested routes
3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Adding a Governance Proposal Form
1. Define parameter form in `src/components/governance/YourParamsForm.tsx`
2. Use parameter schemas from `src/lib/chains/evmd/params.ts`
3. Add tab to `ProposalWizard` component
4. Use `MSG_TYPES` for message type URL

### Working with Wallets
1. Import wallet adapters: `import { getWallet } from '@/lib/wallet'`
2. Get wallet from store: `const { walletType } = useWalletStore()`
3. Connect: `const wallet = getWallet(walletType); await wallet.connect(chainId)`
4. Sign: `await wallet.signAndBroadcast(chainId, messages, fee, memo)`

### Querying Chain Data
1. Use `@tanstack/react-query` for queries
2. Get chain config from store: `const { selectedChain } = useChainStore()`
3. Create StargateClient: `await StargateClient.connect(selectedChain.rpc)`
4. Query and return data for automatic caching/refetching

## Style Guidelines

### Tailwind Usage
- Use design tokens from `tailwind.config.js` (colors: primary, secondary, muted, etc.)
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Dark mode: automatic via `next-themes` with `dark:` prefix
- Spacing: Tailwind's default scale (1 unit = 0.25rem)

### Component Patterns
- Prefer composition over configuration
- Use shadcn components as building blocks
- Extract reusable logic to custom hooks in `src/hooks/`
- Keep components focused and single-responsibility

### TypeScript Patterns
- Prefer `interface` for object shapes, `type` for unions/intersections
- Export types alongside implementations
- Use Zod schemas for runtime validation, infer TypeScript types
- Avoid `any` - use `unknown` and type guards

## Build & Deployment

```bash
# Production build outputs to ./dist
npm run build

# Build artifacts
dist/
├── index.html          # Entry HTML
├── assets/
│   ├── index-*.js      # Bundled JavaScript
│   └── index-*.css     # Bundled CSS
└── ...                 # Static assets from public/
```

Preview build locally with `npm run preview` before deploying.

## Path Aliases

- `@/*` resolves to `./src/*` (configured in `vite.config.ts` and `tsconfig.app.json`)
- Import example: `import { Button } from '@/components/ui/button'`

## Testing Notes

No test framework currently configured. When adding tests, consider:
- Vitest (Vite-native test runner)
- React Testing Library for component tests
- MSW for mocking blockchain API calls
