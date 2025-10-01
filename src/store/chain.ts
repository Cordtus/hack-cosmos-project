import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
