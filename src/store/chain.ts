import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Chain configuration for Cosmos SDK networks
 *
 * @interface ChainConfig
 * @property {string} chainId - Unique chain identifier (e.g., 'cosmoshub-4')
 * @property {string} chainName - Human-readable chain name
 * @property {string} rpc - RPC endpoint URL
 * @property {string} rest - REST/LCD endpoint URL
 * @property {string} bech32Prefix - Address prefix (e.g., 'cosmos', 'evmos')
 * @property {string} coinDenom - Display denomination (e.g., 'ATOM')
 * @property {string} coinMinimalDenom - Minimal denomination (e.g., 'uatom')
 * @property {number} coinDecimals - Decimal places for denomination conversion
 * @property {string} [coinGeckoId] - CoinGecko ID for price queries
 * @property {string} gasPrice - Default gas price with denom (e.g., '0.025uatom')
 * @property {string[]} [features] - Supported features (e.g., 'evm', 'ibc-transfer')
 *
 * @example
 * ```ts
 * const cosmosHub: ChainConfig = {
 *   chainId: 'cosmoshub-4',
 *   chainName: 'Cosmos Hub',
 *   rpc: 'https://rpc.cosmos.network',
 *   rest: 'https://lcd.cosmos.network',
 *   bech32Prefix: 'cosmos',
 *   coinDenom: 'ATOM',
 *   coinMinimalDenom: 'uatom',
 *   coinDecimals: 6,
 *   coinGeckoId: 'cosmos',
 *   gasPrice: '0.025uatom',
 *   features: ['ibc-transfer', 'cosmwasm']
 * };
 * ```
 */
export interface ChainConfig {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  bech32Prefix: string;
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
  gasPrice: string;
  features?: string[];
}

/**
 * Chain state management interface
 *
 * @interface ChainState
 * @property {ChainConfig | null} selectedChain - Currently selected chain
 * @property {ChainConfig[]} chains - All available chain configurations
 * @property {Function} setSelectedChain - Change the active chain
 * @property {Function} addChain - Add a new chain configuration
 * @property {Function} removeChain - Remove a chain by ID
 * @property {Function} updateChain - Update an existing chain's configuration
 * @property {Function} getChain - Get a chain configuration by ID
 */
interface ChainState {
  // Current chain
  selectedChain: ChainConfig | null;
  chains: ChainConfig[];

  // Actions
  setSelectedChain: (chain: ChainConfig) => void;
  addChain: (chain: ChainConfig) => void;
  removeChain: (chainId: string) => void;
  updateChain: (chainId: string, updates: Partial<ChainConfig>) => void;
  getChain: (chainId: string) => ChainConfig | undefined;
}

// Default chains
const DEFAULT_CHAINS: ChainConfig[] = [
  {
    chainId: 'cosmoshub-4',
    chainName: 'Cosmos Hub',
    rpc: 'https://rpc.cosmos.network',
    rest: 'https://lcd.cosmos.network',
    bech32Prefix: 'cosmos',
    coinDenom: 'ATOM',
    coinMinimalDenom: 'uatom',
    coinDecimals: 6,
    coinGeckoId: 'cosmos',
    gasPrice: '0.025uatom',
    features: ['ibc-transfer', 'cosmwasm'],
  },
  {
    chainId: 'evmos_9001-2',
    chainName: 'Evmos',
    rpc: 'https://rpc.evmos.org',
    rest: 'https://lcd.evmos.org',
    bech32Prefix: 'evmos',
    coinDenom: 'EVMOS',
    coinMinimalDenom: 'aevmos',
    coinDecimals: 18,
    coinGeckoId: 'evmos',
    gasPrice: '25000000000aevmos',
    features: ['evm', 'ibc-transfer'],
  },
];

/**
 * Global chain configuration store with persistence
 *
 * @description
 * Manages blockchain network configurations and the currently selected chain.
 * Persists all chain configurations and selection to localStorage.
 * Includes default configurations for Cosmos Hub and Evmos networks.
 *
 * @example
 * ```tsx
 * // In a React component
 * function ChainSelector() {
 *   const { selectedChain, chains, setSelectedChain } = useChainStore();
 *
 *   return (
 *     <select onChange={(e) => {
 *       const chain = chains.find(c => c.chainId === e.target.value);
 *       if (chain) setSelectedChain(chain);
 *     }}>
 *       {chains.map(chain => (
 *         <option key={chain.chainId} value={chain.chainId}>
 *           {chain.chainName}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export const useChainStore = create<ChainState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedChain: DEFAULT_CHAINS[0],
      chains: DEFAULT_CHAINS,

      // Set selected chain
      setSelectedChain: (chain: ChainConfig) => {
        set({ selectedChain: chain });
      },

      // Add new chain
      addChain: (chain: ChainConfig) => {
        const { chains } = get();
        if (!chains.find((c) => c.chainId === chain.chainId)) {
          set({ chains: [...chains, chain] });
        }
      },

      // Remove chain
      removeChain: (chainId: string) => {
        const { chains, selectedChain } = get();
        const filtered = chains.filter((c) => c.chainId !== chainId);
        set({
          chains: filtered,
          selectedChain: selectedChain?.chainId === chainId ? filtered[0] : selectedChain,
        });
      },

      // Update chain config
      updateChain: (chainId: string, updates: Partial<ChainConfig>) => {
        const { chains } = get();
        set({
          chains: chains.map((c) =>
            c.chainId === chainId ? { ...c, ...updates } : c
          ),
        });
      },

      // Get chain by ID
      getChain: (chainId: string) => {
        return get().chains.find((c) => c.chainId === chainId);
      },
    }),
    {
      name: 'chain-storage',
    }
  )
);
