import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, Database, Send, Code, Play, Zap, Settings } from 'lucide-react';
import MethodCard from '@/components/modules/MethodCard';
import QueryInterface from '@/components/modules/QueryInterface';
import TransactionInterface from '@/components/modules/TransactionInterface';

export function ModulesVM() {
  // Query methods from generated proto files
  const queryMethods = [
    {
      name: 'Account',
      type: 'query' as const,
      description: 'Query an Ethereum account by address',
      request: 'QueryAccountRequest',
      response: 'QueryAccountResponse'
    },
    {
      name: 'CosmosAccount',
      type: 'query' as const,
      description: 'Query the Cosmos account associated with an Ethereum address',
      request: 'QueryCosmosAccountRequest',
      response: 'QueryCosmosAccountResponse'
    },
    {
      name: 'ValidatorAccount',
      type: 'query' as const,
      description: 'Query validator account details by consensus address',
      request: 'QueryValidatorAccountRequest',
      response: 'QueryValidatorAccountResponse'
    },
    {
      name: 'Balance',
      type: 'query' as const,
      description: 'Query the balance of an Ethereum account',
      request: 'QueryBalanceRequest',
      response: 'QueryBalanceResponse'
    },
    {
      name: 'Storage',
      type: 'query' as const,
      description: 'Query storage values at a specific key for a contract',
      request: 'QueryStorageRequest',
      response: 'QueryStorageResponse'
    },
    {
      name: 'Code',
      type: 'query' as const,
      description: 'Query the contract code at a given address',
      request: 'QueryCodeRequest',
      response: 'QueryCodeResponse'
    },
    {
      name: 'Params',
      type: 'query' as const,
      description: 'Query the current VM module parameters',
      request: 'QueryParamsRequest',
      response: 'QueryParamsResponse'
    },
    {
      name: 'EthCall',
      type: 'query' as const,
      description: 'Execute an Ethereum call without creating a transaction',
      request: 'EthCallRequest',
      response: 'MsgEthereumTxResponse'
    },
    {
      name: 'EstimateGas',
      type: 'query' as const,
      description: 'Estimate gas needed for an Ethereum transaction',
      request: 'EthCallRequest',
      response: 'EstimateGasResponse'
    },
    {
      name: 'TraceTx',
      type: 'query' as const,
      description: 'Trace the execution of an Ethereum transaction',
      request: 'QueryTraceTxRequest',
      response: 'QueryTraceTxResponse'
    },
    {
      name: 'TraceBlock',
      type: 'query' as const,
      description: 'Trace all transactions in a block',
      request: 'QueryTraceBlockRequest',
      response: 'QueryTraceBlockResponse'
    },
    {
      name: 'BaseFee',
      type: 'query' as const,
      description: 'Query the current base fee for EIP-1559 transactions',
      request: 'QueryBaseFeeRequest',
      response: 'QueryBaseFeeResponse'
    },
    {
      name: 'Config',
      type: 'query' as const,
      description: 'Query the EVM configuration including chain config and feature flags',
      request: 'QueryConfigRequest',
      response: 'QueryConfigResponse'
    },
    {
      name: 'GlobalMinGasPrice',
      type: 'query' as const,
      description: 'Query the global minimum gas price for transactions',
      request: 'QueryGlobalMinGasPriceRequest',
      response: 'QueryGlobalMinGasPriceResponse'
    }
  ];

  // Transaction methods
  const transactionMethods = [
    {
      name: 'EthereumTx',
      type: 'transaction' as const,
      description: 'Submit an Ethereum transaction to the EVM',
      request: 'MsgEthereumTx',
      response: 'MsgEthereumTxResponse'
    },
    {
      name: 'UpdateParams',
      type: 'transaction' as const,
      description: 'Update VM module parameters (governance only)',
      request: 'MsgUpdateParams',
      response: 'MsgUpdateParamsResponse'
    }
  ];

  // Query interfaces with field definitions
  const queryInterfaces = [
    {
      name: 'Account',
      description: 'Query an Ethereum account by address',
      fields: [
        {
          name: 'address',
          type: 'address' as const,
          required: true,
          placeholder: '0x...',
          description: 'Ethereum account address'
        }
      ],
      mockResponse: {
        balance: '1000000000000000000',
        codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        nonce: 5
      }
    },
    {
      name: 'Balance',
      description: 'Query balance of an Ethereum account',
      fields: [
        {
          name: 'address',
          type: 'address' as const,
          required: true,
          placeholder: '0x...',
          description: 'Ethereum account address'
        }
      ],
      mockResponse: {
        balance: '1000000000000000000'
      }
    },
    {
      name: 'Storage',
      description: 'Query contract storage at a specific key',
      fields: [
        {
          name: 'address',
          type: 'address' as const,
          required: true,
          placeholder: '0x...',
          description: 'Contract address'
        },
        {
          name: 'key',
          type: 'string' as const,
          required: true,
          placeholder: '0x0',
          description: 'Storage key'
        }
      ],
      mockResponse: {
        value: '0x0000000000000000000000000000000000000000000000000000000000000001'
      }
    }
  ];

  // Transaction interfaces
  const transactionInterfaces = [
    {
      name: 'EthereumTx',
      description: 'Submit an Ethereum transaction',
      fields: [
        {
          name: 'data',
          type: 'string' as const,
          required: true,
          placeholder: '0x...',
          description: 'Transaction data (encoded)'
        },
        {
          name: 'size',
          type: 'number' as const,
          placeholder: '0',
          description: 'Transaction size'
        },
        {
          name: 'hash',
          type: 'string' as const,
          placeholder: '0x...',
          description: 'Transaction hash'
        }
      ]
    },
    {
      name: 'UpdateParams',
      description: 'Update VM module parameters',
      governanceOnly: true,
      fields: [
        {
          name: 'evmDenom',
          type: 'string' as const,
          placeholder: 'aatom',
          description: 'EVM denomination'
        },
        {
          name: 'enableCreate',
          type: 'boolean' as const,
          description: 'Allow contract creation'
        },
        {
          name: 'enableCall',
          type: 'boolean' as const,
          description: 'Allow contract calls'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">VM (EVM) Module</h1>
          <p className="text-muted-foreground text-sm">
            Ethereum Virtual Machine for smart contracts
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            EVM Core
          </Badge>
          <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
            14 Queries
          </Badge>
          <Badge className="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400">
            2 Transactions
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="queries" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full bg-muted/50">
          <TabsTrigger value="queries" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400">
            <Database className="w-4 h-4" />
            Queries
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-400">
            <Send className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="query-interface" className="flex items-center gap-2 data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 dark:data-[state=active]:bg-cyan-900/30 dark:data-[state=active]:text-cyan-400">
            <Play className="w-4 h-4" />
            Test
          </TabsTrigger>
          <TabsTrigger value="tx-interface" className="flex items-center gap-2 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-400">
            <Zap className="w-4 h-4" />
            Execute
          </TabsTrigger>
          <TabsTrigger value="params" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400">
            <Settings className="w-4 h-4" />
            Params
          </TabsTrigger>
          <TabsTrigger value="precompiles" className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 dark:data-[state=active]:bg-rose-900/30 dark:data-[state=active]:text-rose-400">
            <Code className="w-4 h-4" />
            Precompiles
          </TabsTrigger>
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
              Test VM module queries directly. Responses follow proto definitions.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queryInterfaces.map((query) => (
              <QueryInterface key={query.name} method={query} module="vm" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tx-interface" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Execute VM transactions. Connect wallet to broadcast.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactionInterfaces.map((tx) => (
              <TransactionInterface key={tx.name} method={tx} module="vm" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="params" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Parameters</CardTitle>
              <CardDescription>
                Configurable parameters that control the VM module behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">evm_denom</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The denomination used for EVM transactions and gas fees
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">string</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">aatom</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">enable_create</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Allow contract creation via CREATE opcode
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">boolean</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">true</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">enable_call</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Allow contract calls via CALL opcode
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">boolean</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">true</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">extra_eips</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Additional EIPs to enable beyond the default set
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">int64[]</code>
                    <span className="text-muted-foreground">Example:</span>
                    <code className="bg-muted px-2 py-1 rounded">[2929, 2930, 1559]</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">allow_unprotected_txs</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Allow replay-unprotected transactions (not recommended for production)
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">boolean</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">false</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">active_precompiles</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    List of active precompiled contracts addresses
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">string[]</code>
                    <span className="text-muted-foreground">Example:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">0x0...0801</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precompiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Precompiled Contracts</CardTitle>
              <CardDescription>
                Built-in contracts that provide optimized implementations of common operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Standard Ethereum Precompiles</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <code>0x01</code> - ECDSA Recovery</li>
                    <li>• <code>0x02</code> - SHA256 Hash</li>
                    <li>• <code>0x03</code> - RIPEMD160 Hash</li>
                    <li>• <code>0x04</code> - Identity</li>
                    <li>• <code>0x05</code> - Modular Exponentiation</li>
                    <li>• <code>0x06</code> - BN256 Addition</li>
                    <li>• <code>0x07</code> - BN256 Multiplication</li>
                    <li>• <code>0x08</code> - BN256 Pairing</li>
                    <li>• <code>0x09</code> - Blake2F</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Cosmos-Specific Precompiles</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <code>0x800</code> - Bank Module</li>
                    <li>• <code>0x801</code> - Staking Module</li>
                    <li>• <code>0x802</code> - Distribution Module</li>
                    <li>• <code>0x803</code> - IBC Transfer</li>
                    <li>• <code>0x804</code> - Vesting Module</li>
                    <li>• <code>0x805</code> - Authorization</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Precompiled contracts provide gas-efficient access to native Cosmos SDK modules directly from EVM smart contracts,
                  enabling cross-chain composability and advanced DeFi primitives.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}