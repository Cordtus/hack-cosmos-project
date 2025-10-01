import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Database, Send, Code } from 'lucide-react';
import MethodCard from '@/components/modules/MethodCard';

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

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">VM (EVM) Module</h1>
        <p className="text-muted-foreground mt-2">
          Ethereum Virtual Machine implementation for Cosmos SDK chains
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The VM module provides a full Ethereum Virtual Machine implementation, enabling smart contract execution,
          account management, and Ethereum-compatible transactions on Cosmos chains.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Module Overview</CardTitle>
          <CardDescription>
            Key capabilities and features of the VM module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Core Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• EVM bytecode execution</li>
                <li>• Ethereum account model</li>
                <li>• Smart contract deployment</li>
                <li>• Gas metering and fees</li>
                <li>• State transitions and storage</li>
                <li>• Transaction tracing and debugging</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Ethereum Compatibility</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• EIP-1559 (Dynamic base fee)</li>
                <li>• EIP-2929 (Gas cost increases)</li>
                <li>• EIP-2930 (Access lists)</li>
                <li>• Solidity & Vyper support</li>
                <li>• Web3 JSON-RPC API</li>
                <li>• MetaMask integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="queries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queries" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Query Methods
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Transaction Methods
          </TabsTrigger>
          <TabsTrigger value="params">Parameters</TabsTrigger>
          <TabsTrigger value="precompiles">
            <Code className="w-4 h-4 mr-2" />
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
                    <code className="bg-muted px-2 py-1 rounded">aevmos</code>
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