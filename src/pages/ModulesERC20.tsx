import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddressInput } from '@/components/custom/AddressInput';
import { Coins, ArrowRightLeft, Plus, Search, Info } from 'lucide-react';

interface TokenPair {
  erc20Address: string;
  cosmosIbc: string;
  enabled: boolean;
}

export function ModulesERC20() {
  const [activeTab, setActiveTab] = useState('pairs');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const tokenPairs: TokenPair[] = [
    {
      erc20Address: '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
      cosmosIbc: 'ibc/D1542AA8762DB13087D8364F3EA6509FD6F009A34F00426AF9E4F9FA85CBBF1F',
      enabled: true,
    },
    {
      erc20Address: '0xFA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b',
      cosmosIbc: 'ibc/2180E84E20F5679FCC760D8C165B60F42065DEF7F46A72B447CFF1B7DC6C0A65',
      enabled: true,
    },
  ];

  const currentParams = {
    enable_erc20: true,
    enable_evm_hook: true,
    dynamic_precompiles: [
      '0x0000000000000000000000000000000000000800'
    ]
  };

  const filteredPairs = tokenPairs.filter(
    pair =>
      pair.erc20Address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.cosmosIbc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ERC20 Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage ERC20 token conversions between Cosmos and EVM
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="pairs">
            <Coins className="mr-2 h-4 w-4" />
            Token Pairs
          </TabsTrigger>
          <TabsTrigger value="convert">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Convert
          </TabsTrigger>
          <TabsTrigger value="register">
            <Plus className="mr-2 h-4 w-4" />
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pairs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Parameters</CardTitle>
              <CardDescription>Current ERC20 module configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ERC20 Module</Label>
                  <Badge variant={currentParams.enable_erc20 ? 'default' : 'secondary'}>
                    {currentParams.enable_erc20 ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>EVM Hook</Label>
                  <Badge variant={currentParams.enable_evm_hook ? 'default' : 'secondary'}>
                    {currentParams.enable_evm_hook ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Registered Token Pairs</CardTitle>
                  <CardDescription>ERC20 tokens paired with Cosmos coins</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPairs.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No token pairs found matching your search.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ERC20 Address</TableHead>
                      <TableHead>Cosmos IBC/Denom</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPairs.map((pair, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">
                          {pair.erc20Address}
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-[200px] truncate">
                          {pair.cosmosIbc}
                        </TableCell>
                        <TableCell>
                          <Badge variant={pair.enabled ? 'default' : 'secondary'}>
                            {pair.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Toggle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Convert Tokens</CardTitle>
              <CardDescription>
                Convert between Cosmos coins and ERC20 tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Conversion Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    Cosmos → ERC20
                  </Button>
                  <Button variant="outline" className="w-full">
                    ERC20 → Cosmos
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Receiver Address</Label>
                <AddressInput
                  placeholder="0x... or evmos1..."
                  value=""
                  onChange={() => {}}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="0.0" />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Connect your wallet to perform token conversions.
                </AlertDescription>
              </Alert>

              <Button className="w-full" disabled>
                Connect Wallet to Convert
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Register New Token Pair</CardTitle>
              <CardDescription>
                Submit a proposal to register a new ERC20/Cosmos token pair
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Token registration requires a governance proposal. You can register:
                  <ul className="list-disc list-inside mt-2">
                    <li>Native Cosmos coins as ERC20 tokens</li>
                    <li>ERC20 tokens as Cosmos coins</li>
                    <li>IBC vouchers as ERC20 tokens</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Registration Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    Native Coin
                  </Button>
                  <Button variant="outline" size="sm">
                    ERC20 Token
                  </Button>
                  <Button variant="outline" size="sm">
                    IBC Voucher
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contract Address / IBC Denom</Label>
                <Input placeholder="Enter address or IBC denom..." />
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  Create Registration Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}