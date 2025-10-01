import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { VmParamsForm } from '@/components/governance/VmParamsForm';
import { PrecompileSelector } from '@/components/custom/PrecompileSelector';
import { AccessControlEditor } from '@/components/custom/AccessControlEditor';
import { Zap, Info, Settings, Shield, Code } from 'lucide-react';

export function ModulesVM() {
  const [activeTab, setActiveTab] = useState('params');

  // Mock current params - replace with actual API call
  const currentParams = {
    evm_denom: 'aevmos',
    enable_create: true,
    enable_call: true,
    extra_eips: ['2929', '2930', '1559'],
    chain_config: {
      homestead_block: '0',
      dao_fork_block: '0',
      dao_fork_support: true,
      eip150_block: '0',
      eip150_hash: '0x0',
      eip155_block: '0',
      eip158_block: '0',
      byzantium_block: '0',
      constantinople_block: '0',
      petersburg_block: '0',
      istanbul_block: '0',
      muir_glacier_block: '0',
      berlin_block: '0',
      london_block: '0',
      arrow_glacier_block: '0',
      gray_glacier_block: '0',
      merge_netsplit_block: '0',
      shanghai_block: '0',
      cancun_block: '0'
    },
    allow_unprotected_txs: false,
    active_precompiles: ['0x0000000000000000000000000000000000000801']
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">VM (EVM) Module</h1>
        <p className="text-muted-foreground mt-2">
          Query and manage Ethereum Virtual Machine settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="params">
            <Settings className="mr-2 h-4 w-4" />
            Parameters
          </TabsTrigger>
          <TabsTrigger value="precompiles">
            <Code className="mr-2 h-4 w-4" />
            Precompiles
          </TabsTrigger>
          <TabsTrigger value="access">
            <Shield className="mr-2 h-4 w-4" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="query">
            <Zap className="mr-2 h-4 w-4" />
            Queries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current VM Parameters</CardTitle>
              <CardDescription>
                View and propose changes to VM module parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Core Settings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">EVM Denom:</span>
                    <code className="font-mono">{currentParams.evm_denom}</code>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Enable Create:</span>
                    <Badge variant={currentParams.enable_create ? 'default' : 'secondary'}>
                      {currentParams.enable_create ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Enable Call:</span>
                    <Badge variant={currentParams.enable_call ? 'default' : 'secondary'}>
                      {currentParams.enable_call ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Allow Unprotected Txs:</span>
                    <Badge variant={currentParams.allow_unprotected_txs ? 'destructive' : 'default'}>
                      {currentParams.allow_unprotected_txs ? 'Allowed' : 'Protected'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Active EIPs</h3>
                <div className="flex flex-wrap gap-2">
                  {currentParams.extra_eips.map((eip) => (
                    <Badge key={eip} variant="outline">
                      EIP-{eip}
                    </Badge>
                  ))}
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  To modify these parameters, create a governance proposal through the proposal wizard.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precompiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Precompiled Contracts</CardTitle>
              <CardDescription>
                Manage active precompiled contracts on the EVM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrecompileSelector
                value={currentParams.active_precompiles || []}
                onChange={(precompiles) => {
                  console.log('Precompiles changed:', precompiles);
                  // Handle precompile changes
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Control List</CardTitle>
              <CardDescription>
                Configure permissions for EVM operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccessControlEditor
                value={{
                  create: {
                    access_type: 'ACCESS_TYPE_PERMISSIONLESS',
                    access_control_list: [],
                  },
                  call: {
                    access_type: 'ACCESS_TYPE_PERMISSIONLESS',
                    access_control_list: [],
                  },
                }}
                onChange={(accessControl) => {
                  console.log('Access control changed:', accessControl);
                  // Handle access control changes
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Query VM State</CardTitle>
              <CardDescription>
                Execute queries against the VM module
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Account Query</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Query Account
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Balance Query</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Query Balance
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Storage Query</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Query Storage
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Code Query</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Query Code
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}