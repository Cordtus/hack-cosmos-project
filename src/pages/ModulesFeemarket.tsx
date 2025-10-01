import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, Database, Send, Play, Zap, TrendingUp } from 'lucide-react';
import MethodCard from '@/components/modules/MethodCard';
import QueryInterface from '@/components/modules/QueryInterface';
import TransactionInterface from '@/components/modules/TransactionInterface';

export function ModulesFeemarket() {
  // Query methods from generated proto files
  const queryMethods = [
    {
      name: 'Params',
      type: 'query' as const,
      description: 'Query current feemarket module parameters',
      request: 'QueryParamsRequest',
      response: 'QueryParamsResponse'
    },
    {
      name: 'BaseFee',
      type: 'query' as const,
      description: 'Query the current EIP-1559 base fee',
      request: 'QueryBaseFeeRequest',
      response: 'QueryBaseFeeResponse'
    },
    {
      name: 'BlockGas',
      type: 'query' as const,
      description: 'Query the gas used in the current block',
      request: 'QueryBlockGasRequest',
      response: 'QueryBlockGasResponse'
    }
  ];

  // Query interfaces with field definitions
  const queryInterfaces = [
    {
      name: 'Params',
      description: 'Get current feemarket parameters',
      fields: [],
      mockResponse: {
        params: {
          noBaseFee: false,
          baseFeeChangeDenominator: 8,
          elasticityMultiplier: 2,
          baseFee: '1000000000',
          enableHeight: '0',
          minGasPrice: '0',
          minGasMultiplier: '0.5'
        }
      }
    },
    {
      name: 'BaseFee',
      description: 'Get current base fee for EIP-1559 transactions',
      fields: [],
      mockResponse: {
        baseFee: '1000000000'
      }
    },
    {
      name: 'BlockGas',
      description: 'Get gas consumption for current block',
      fields: [],
      mockResponse: {
        gas: 21000
      }
    }
  ];

  // Transaction methods
  const transactionMethods = [
    {
      name: 'UpdateParams',
      type: 'transaction' as const,
      description: 'Update feemarket module parameters (governance only)',
      request: 'MsgUpdateParams',
      response: 'MsgUpdateParamsResponse'
    }
  ];

  // Transaction interfaces
  const transactionInterfaces = [
    {
      name: 'UpdateParams',
      description: 'Update feemarket module parameters',
      governanceOnly: true,
      fields: [
        {
          name: 'noBaseFee',
          type: 'boolean' as const,
          description: 'Disable EIP-1559 base fee'
        },
        {
          name: 'baseFeeChangeDenominator',
          type: 'number' as const,
          placeholder: '8',
          description: 'Controls base fee adjustment rate'
        },
        {
          name: 'elasticityMultiplier',
          type: 'number' as const,
          placeholder: '2',
          description: 'Maximum block gas increase from target'
        },
        {
          name: 'baseFee',
          type: 'string' as const,
          placeholder: '1000000000',
          description: 'Initial base fee (in wei)'
        },
        {
          name: 'minGasPrice',
          type: 'string' as const,
          placeholder: '0',
          description: 'Minimum gas price'
        },
        {
          name: 'minGasMultiplier',
          type: 'string' as const,
          placeholder: '0.5',
          description: 'Minimum gas price multiplier'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feemarket Module</h1>
          <p className="text-muted-foreground text-sm">
            EIP-1559 dynamic fee market for EVM transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            Gas Pricing
          </Badge>
          <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
            3 Queries
          </Badge>
          <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
            1 Transaction
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
            Params
          </TabsTrigger>
          <TabsTrigger value="info" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            EIP-1559
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
              Test feemarket queries. Responses follow proto definitions.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queryInterfaces.map((query) => (
              <QueryInterface key={query.name} method={query} module="feemarket" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tx-interface" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Update feemarket parameters via governance proposal.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactionInterfaces.map((tx) => (
              <TransactionInterface key={tx.name} method={tx} module="feemarket" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="params" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Parameters</CardTitle>
              <CardDescription>
                Configurable parameters controlling the fee market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">no_base_fee</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Disable EIP-1559 base fee mechanism
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">boolean</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">false</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">base_fee_change_denominator</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Controls how quickly base fee adjusts to gas usage
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">uint32</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">8</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">elasticity_multiplier</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Maximum gas limit increase from target gas
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">uint32</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">2</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">base_fee</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Initial base fee in wei
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">string</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">1000000000</code>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">min_gas_price</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Minimum accepted gas price
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="bg-muted px-2 py-1 rounded">Dec</code>
                    <span className="text-muted-foreground">Default:</span>
                    <code className="bg-muted px-2 py-1 rounded">0</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>EIP-1559 Overview</CardTitle>
              <CardDescription>Dynamic fee market mechanism</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                EIP-1559 introduces a base fee that adjusts dynamically based on network congestion,
                making gas prices more predictable and improving user experience.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Key Concepts</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• <strong>Base Fee:</strong> Minimum price per gas, burned on each transaction</li>
                    <li>• <strong>Priority Fee:</strong> Optional tip to validators for faster inclusion</li>
                    <li>• <strong>Max Fee:</strong> Maximum total fee user is willing to pay</li>
                    <li>• <strong>Gas Target:</strong> Target gas usage per block (50% of max)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Fee Adjustment Algorithm</h3>
                  <ol className="text-sm space-y-1 ml-4 list-decimal">
                    <li>If block gas exceeds target: base fee increases</li>
                    <li>If block gas below target: base fee decreases</li>
                    <li>Maximum change: ±12.5% per block</li>
                    <li>Elasticity allows 2x target gas in emergencies</li>
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