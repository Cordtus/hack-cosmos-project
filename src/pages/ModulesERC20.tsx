import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Database, Send, Play, Zap } from 'lucide-react';
import MethodCard from '@/components/modules/MethodCard';
import QueryInterface from '@/components/modules/QueryInterface';
import TransactionInterface from '@/components/modules/TransactionInterface';

export function ModulesERC20() {
  // Query methods from generated proto files
  const queryMethods = [
    {
      name: 'TokenPairs',
      type: 'query' as const,
      description: 'Retrieves all registered token pairs between Cosmos and ERC20 tokens',
      request: 'QueryTokenPairsRequest',
      response: 'QueryTokenPairsResponse'
    },
    {
      name: 'TokenPair',
      type: 'query' as const,
      description: 'Retrieves a specific token pair by token address',
      request: 'QueryTokenPairRequest',
      response: 'QueryTokenPairResponse'
    },
    {
      name: 'Params',
      type: 'query' as const,
      description: 'Retrieves the current ERC20 module parameters',
      request: 'QueryParamsRequest',
      response: 'QueryParamsResponse'
    }
  ];

  // Query interfaces with detailed field definitions
  const queryInterfaces = [
    {
      name: 'TokenPairs',
      description: 'Query all registered token pairs',
      fields: [
        {
          name: 'pagination',
          type: 'string' as const,
          placeholder: 'Optional: pagination key',
          description: 'Pagination key for fetching specific page of results'
        }
      ],
      mockResponse: {
        tokenPairs: [
          {
            erc20Address: '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
            denom: 'ibc/D1542AA8762DB13087D8364F3EA6509FD6F009A34F00426AF9E4F9FA85CBBF1F',
            enabled: true,
            contractOwner: 'OWNER_MODULE'
          },
          {
            erc20Address: '0xFA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b',
            denom: 'uosmo',
            enabled: true,
            contractOwner: 'OWNER_MODULE'
          }
        ],
        pagination: { nextKey: null, total: '2' }
      }
    },
    {
      name: 'TokenPair',
      description: 'Query a specific token pair by token address',
      fields: [
        {
          name: 'token',
          type: 'address' as const,
          required: true,
          placeholder: '0x... or denom',
          description: 'ERC20 address or Cosmos denomination'
        }
      ],
      mockResponse: {
        tokenPair: {
          erc20Address: '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
          denom: 'uatom',
          enabled: true,
          contractOwner: 'OWNER_MODULE'
        }
      }
    },
    {
      name: 'Params',
      description: 'Query current ERC20 module parameters',
      fields: [],
      mockResponse: {
        params: {
          enableErc20: true,
          enableEvmHook: true
        }
      }
    }
  ];

  // Transaction methods (common ERC20 operations)
  const transactionMethods = [
    {
      name: 'ConvertCoin',
      type: 'transaction' as const,
      description: 'Convert native Cosmos coins to ERC20 tokens',
      request: 'MsgConvertCoin',
      response: 'MsgConvertCoinResponse'
    },
    {
      name: 'ConvertERC20',
      type: 'transaction' as const,
      description: 'Convert ERC20 tokens to native Cosmos coins',
      request: 'MsgConvertERC20',
      response: 'MsgConvertERC20Response'
    },
    {
      name: 'RegisterCoin',
      type: 'transaction' as const,
      description: 'Register a Cosmos coin for ERC20 representation',
      request: 'MsgRegisterCoin',
      response: 'MsgRegisterCoinResponse'
    },
    {
      name: 'RegisterERC20',
      type: 'transaction' as const,
      description: 'Register an ERC20 token for Cosmos coin representation',
      request: 'MsgRegisterERC20',
      response: 'MsgRegisterERC20Response'
    },
    {
      name: 'ToggleConversion',
      type: 'transaction' as const,
      description: 'Enable or disable conversion for a token pair',
      request: 'MsgToggleConversion',
      response: 'MsgToggleConversionResponse'
    },
    {
      name: 'UpdateParams',
      type: 'transaction' as const,
      description: 'Update ERC20 module parameters (governance only)',
      request: 'MsgUpdateParams',
      response: 'MsgUpdateParamsResponse'
    }
  ];

  // Transaction interfaces with detailed field definitions
  const transactionInterfaces = [
    {
      name: 'ConvertCoin',
      description: 'Convert native Cosmos coins to ERC20 tokens',
      fields: [
        {
          name: 'coin',
          type: 'coin' as const,
          required: true,
          description: 'The Cosmos coin to convert (amount and denom)'
        },
        {
          name: 'receiver',
          type: 'address' as const,
          required: true,
          placeholder: '0x...',
          description: 'Ethereum address to receive the ERC20 tokens'
        },
        {
          name: 'sender',
          type: 'address' as const,
          required: true,
          placeholder: 'cosmos1...',
          description: 'Cosmos address sending the coins'
        }
      ]
    },
    {
      name: 'ConvertERC20',
      description: 'Convert ERC20 tokens to native Cosmos coins',
      fields: [
        {
          name: 'contractAddress',
          type: 'address' as const,
          required: true,
          placeholder: '0x...',
          description: 'ERC20 contract address'
        },
        {
          name: 'amount',
          type: 'string' as const,
          required: true,
          placeholder: '1000000000000000000',
          description: 'Amount in the smallest unit (wei)'
        },
        {
          name: 'receiver',
          type: 'address' as const,
          required: true,
          placeholder: 'cosmos1...',
          description: 'Cosmos address to receive the native coins'
        },
        {
          name: 'sender',
          type: 'address' as const,
          required: true,
          placeholder: '0x...',
          description: 'Ethereum address sending the tokens'
        }
      ]
    },
    {
      name: 'RegisterCoin',
      description: 'Register a Cosmos coin for ERC20 representation',
      governanceOnly: true,
      fields: [
        {
          name: 'metadata',
          type: 'string' as const,
          required: true,
          placeholder: 'uatom',
          description: 'The coin metadata/denom to register'
        }
      ]
    },
    {
      name: 'RegisterERC20',
      description: 'Register an ERC20 token for Cosmos coin representation',
      governanceOnly: true,
      fields: [
        {
          name: 'erc20address',
          type: 'address' as const,
          required: true,
          placeholder: '0x...',
          description: 'ERC20 contract address to register'
        }
      ]
    },
    {
      name: 'ToggleConversion',
      description: 'Enable or disable conversion for a token pair',
      governanceOnly: true,
      fields: [
        {
          name: 'token',
          type: 'address' as const,
          required: true,
          placeholder: '0x... or denom',
          description: 'Token address or denomination to toggle'
        }
      ]
    },
    {
      name: 'UpdateParams',
      description: 'Update ERC20 module parameters',
      governanceOnly: true,
      fields: [
        {
          name: 'enableErc20',
          type: 'boolean' as const,
          description: 'Enable or disable the ERC20 module'
        },
        {
          name: 'enableEvmHook',
          type: 'boolean' as const,
          description: 'Enable or disable EVM hooks'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ERC20 Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage token pairs and conversions between native Cosmos coins and ERC20 tokens
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The ERC20 module enables seamless interoperability between Cosmos native coins and ERC20 tokens on the EVM.
          It maintains a registry of token pairs and handles bidirectional conversions.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Module Overview</CardTitle>
          <CardDescription>
            Key capabilities and features of the ERC20 module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Core Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Token pair registration and management</li>
                <li>• Bidirectional token conversion</li>
                <li>• Automatic contract deployment</li>
                <li>• Conversion toggle controls</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Use Cases</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bridge native tokens to EVM ecosystem</li>
                <li>• Enable DeFi composability</li>
                <li>• Cross-chain asset transfers</li>
                <li>• Token standardization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="queries" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="queries" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Queries
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="query-interface" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Query Test
          </TabsTrigger>
          <TabsTrigger value="tx-interface" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Tx Execute
          </TabsTrigger>
          <TabsTrigger value="params">Parameters</TabsTrigger>
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
        </TabsList>

        <TabsContent value="queries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queryMethods.map((method) => (
              <MethodCard key={method.name} method={method} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactionMethods.map((method) => (
              <MethodCard key={method.name} method={method} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="query-interface" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Test ERC20 module queries directly. Responses are mocked but follow the actual proto definitions.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queryInterfaces.map((query) => (
              <QueryInterface key={query.name} method={query} module="erc20" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tx-interface" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Execute ERC20 module transactions. Connect your wallet to broadcast transactions.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactionInterfaces.map((tx) => (
              <TransactionInterface key={tx.name} method={tx} module="erc20" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="params" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Parameters</CardTitle>
              <CardDescription>
                Configurable parameters that control the ERC20 module behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">enable_erc20</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Global switch to enable or disable the ERC20 module functionality
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">boolean</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">true</code>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">enable_evm_hook</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enable EVM hook for automatic token pair registration and conversion
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">boolean</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">true</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concepts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Pairs</CardTitle>
              <CardDescription>Understanding the token pair mechanism</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                A token pair represents a bidirectional mapping between a native Cosmos coin denomination
                and an ERC20 contract address on the EVM. Each pair maintains:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li>• <strong>Cosmos Denom:</strong> The native coin denomination (e.g., "uatom", "uosmo")</li>
                <li>• <strong>ERC20 Address:</strong> The corresponding ERC20 contract address</li>
                <li>• <strong>Enabled Status:</strong> Whether conversions are currently allowed</li>
                <li>• <strong>Contract Type:</strong> Native (Cosmos-originated) or ERC20 (EVM-originated)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Process</CardTitle>
              <CardDescription>How token conversions work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Cosmos to ERC20</h3>
                  <ol className="text-sm space-y-1 ml-4 list-decimal">
                    <li>User initiates ConvertCoin transaction with Cosmos coins</li>
                    <li>Module locks the native coins in module account</li>
                    <li>Equivalent ERC20 tokens are minted to user's EVM address</li>
                    <li>Balance is reflected in both Cosmos and EVM contexts</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2">ERC20 to Cosmos</h3>
                  <ol className="text-sm space-y-1 ml-4 list-decimal">
                    <li>User initiates ConvertERC20 transaction with ERC20 tokens</li>
                    <li>ERC20 tokens are burned from user's EVM address</li>
                    <li>Equivalent native coins are released from module account</li>
                    <li>Coins are transferred to user's Cosmos address</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}