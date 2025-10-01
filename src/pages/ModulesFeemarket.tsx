import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Settings, TrendingUp, Activity, Info } from 'lucide-react';

export function ModulesFeemarket() {
  const [activeTab, setActiveTab] = useState('params');

  // Mock data - replace with actual API calls
  const currentParams = {
    no_base_fee: false,
    base_fee_change_denominator: 8,
    elasticity_multiplier: 2,
    enable_height: '0',
    base_fee: '1000000000',
    min_gas_price: '0.000000000000000000',
    min_gas_multiplier: '0.5'
  };

  const gasMetrics = {
    currentBaseFee: '1.5 GWEI',
    averageGasPrice: '2.1 GWEI',
    blockUtilization: 65,
    targetGas: 15000000,
    gasUsed: 9750000,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fee Market Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage EIP-1559 dynamic fee market parameters
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="params">
            <Settings className="mr-2 h-4 w-4" />
            Parameters
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <TrendingUp className="mr-2 h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="history">
            <Activity className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Fee Market Parameters</CardTitle>
              <CardDescription>
                EIP-1559 dynamic fee configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Base Fee Configuration</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">No Base Fee:</span>
                    <Badge variant={currentParams.no_base_fee ? 'destructive' : 'default'}>
                      {currentParams.no_base_fee ? 'Disabled' : 'Enabled'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Current Base Fee:</span>
                    <code className="font-mono">{currentParams.base_fee} wei</code>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Change Denominator:</span>
                    <span>{currentParams.base_fee_change_denominator}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Elasticity Multiplier:</span>
                    <span>{currentParams.elasticity_multiplier}x</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Gas Price Settings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Min Gas Price:</span>
                    <code className="font-mono">{currentParams.min_gas_price}</code>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Min Gas Multiplier:</span>
                    <span>{currentParams.min_gas_multiplier}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Enable Height:</span>
                    <code className="font-mono">{currentParams.enable_height}</code>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Fee market parameters can only be modified through governance proposals.
                  Changes affect gas pricing for all EVM transactions.
                </AlertDescription>
              </Alert>

              <Button className="w-full">
                Create Parameter Change Proposal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Base Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gasMetrics.currentBaseFee}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Updates each block
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Gas Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gasMetrics.averageGasPrice}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 100 blocks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Block Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gasMetrics.blockUtilization}%</div>
                <Progress value={gasMetrics.blockUtilization} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gas Usage</CardTitle>
              <CardDescription>Current block gas consumption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gas Used</span>
                  <span className="font-mono">{gasMetrics.gasUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Gas</span>
                  <span className="font-mono">{gasMetrics.targetGas.toLocaleString()}</span>
                </div>
              </div>
              <Progress
                value={(gasMetrics.gasUsed / gasMetrics.targetGas) * 100}
                className="h-3"
              />
              <Alert>
                <AlertDescription className="text-sm">
                  When gas usage exceeds the target, base fee increases. When below target, base fee decreases.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee History</CardTitle>
              <CardDescription>
                Historical base fee and gas price data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fee history visualization coming soon</p>
                <p className="text-sm mt-2">
                  Track base fee changes and gas price trends over time
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}