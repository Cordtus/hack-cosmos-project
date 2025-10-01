import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AddressInput } from '@/components/custom/AddressInput';
import {
  Users,
  Plus,
  Key,
  FileSignature,
  CheckCircle2,
  Clock,
  Shield,
  Copy,
  ExternalLink,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface Signer {
  address: string;
  pubkey: string;
  weight: number;
  hasSigned?: boolean;
}

interface MultisigWallet {
  id: string;
  name: string;
  address: string;
  threshold: number;
  signers: Signer[];
  created: string;
}

interface PendingTransaction {
  id: string;
  walletId: string;
  description: string;
  amount: string;
  to: string;
  signatures: number;
  required: number;
  status: 'pending' | 'ready' | 'executed';
  created: string;
}

export function TransactionsMultisig() {
  const [activeTab, setActiveTab] = useState('wallets');
  const [selectedWallet, setSelectedWallet] = useState<MultisigWallet | null>(null);

  // Create wallet form state
  const [walletName, setWalletName] = useState('');
  const [threshold, setThreshold] = useState(2);
  const [signers, setSigners] = useState<Signer[]>([
    { address: '', pubkey: '', weight: 1 }
  ]);

  // Mock data
  const [wallets] = useState<MultisigWallet[]>([
    {
      id: '1',
      name: 'Treasury Multisig',
      address: 'cosmos1multisig...abc123',
      threshold: 2,
      signers: [
        { address: 'cosmos1alice...', pubkey: 'pubkey1', weight: 1, hasSigned: true },
        { address: 'cosmos1bob...', pubkey: 'pubkey2', weight: 1, hasSigned: true },
        { address: 'cosmos1charlie...', pubkey: 'pubkey3', weight: 1, hasSigned: false }
      ],
      created: '2024-01-15'
    }
  ]);

  const [pendingTxs] = useState<PendingTransaction[]>([
    {
      id: '1',
      walletId: '1',
      description: 'Team salary payment',
      amount: '1000 ATOM',
      to: 'cosmos1recipient...',
      signatures: 2,
      required: 2,
      status: 'ready',
      created: '2024-01-20'
    },
    {
      id: '2',
      walletId: '1',
      description: 'Infrastructure costs',
      amount: '500 ATOM',
      to: 'cosmos1provider...',
      signatures: 1,
      required: 2,
      status: 'pending',
      created: '2024-01-21'
    }
  ]);

  const addSigner = () => {
    setSigners([...signers, { address: '', pubkey: '', weight: 1 }]);
  };

  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(signers.filter((_, i) => i !== index));
    }
  };

  const updateSigner = (index: number, field: keyof Signer, value: any) => {
    setSigners(signers.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'executed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Multisig Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage multisignature wallets and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
            Secure Custody
          </Badge>
          <Badge variant="outline">
            {wallets.length} Wallets
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full bg-muted/50">
          <TabsTrigger value="wallets" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-400">
            <Users className="w-4 h-4" />
            Wallets
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400">
            <Plus className="w-4 h-4" />
            Create
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2 data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 dark:data-[state=active]:bg-cyan-900/30 dark:data-[state=active]:text-cyan-400">
            <FileSignature className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="sign" className="flex items-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400">
            <Key className="w-4 h-4" />
            Sign
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedWallet(wallet)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {wallet.name}
                        <Badge variant="outline">
                          {wallet.threshold}/{wallet.signers.length} required
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <code className="text-xs">{wallet.address}</code>
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Signers</Label>
                      <div className="mt-2 space-y-2">
                        {wallet.signers.map((signer, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <code className="text-xs truncate flex-1">
                              {signer.address}
                            </code>
                            <Badge variant={signer.hasSigned ? 'default' : 'outline'} className="ml-2">
                              Weight: {signer.weight}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Created</span>
                      <span>{wallet.created}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Multisig Wallet</CardTitle>
              <CardDescription>
                Set up a new multisignature wallet with multiple signers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Wallet Name</Label>
                <Input
                  placeholder="e.g., Treasury Multisig"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>

              <div>
                <Label>Signing Threshold</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="number"
                    min="1"
                    max={signers.length}
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    of {signers.length} signers required
                  </span>
                </div>
              </div>

              <div>
                <Label>Signers</Label>
                <div className="space-y-3 mt-2">
                  {signers.map((signer, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Address</Label>
                        <AddressInput
                          placeholder="cosmos1..."
                          value={signer.address}
                          onChange={(value) => updateSigner(index, 'address', value)}
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Weight</Label>
                        <Input
                          type="number"
                          min="1"
                          value={signer.weight}
                          onChange={(e) => updateSigner(index, 'weight', parseInt(e.target.value))}
                        />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeSigner(index)}
                        disabled={signers.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addSigner}
                  className="w-full mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Signer
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  All signers must have their public keys registered on-chain before creating the multisig.
                  The wallet address will be deterministically generated from the signers and threshold.
                </AlertDescription>
              </Alert>

              <Button className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Create Multisig Wallet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="space-y-4">
            {pendingTxs.map((tx) => (
              <Card key={tx.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{tx.description}</CardTitle>
                      <CardDescription className="mt-1">
                        To: <code className="text-xs">{tx.to}</code>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status === 'ready' ? 'Ready to Execute' :
                       tx.status === 'pending' ? 'Awaiting Signatures' : 'Executed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-mono font-semibold">{tx.amount}</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Signatures</span>
                        <span className="text-sm">
                          {tx.signatures} / {tx.required}
                        </span>
                      </div>
                      <Progress value={(tx.signatures / tx.required) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Created
                      </span>
                      <span>{tx.created}</span>
                    </div>

                    <div className="flex gap-2">
                      {tx.status === 'pending' && (
                        <Button className="flex-1" variant="outline">
                          <Key className="h-4 w-4 mr-2" />
                          Sign Transaction
                        </Button>
                      )}
                      {tx.status === 'ready' && (
                        <Button className="flex-1">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Execute Transaction
                        </Button>
                      )}
                      {tx.status === 'executed' && (
                        <Button className="flex-1" variant="outline" disabled>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Executed
                        </Button>
                      )}
                      <Button size="icon" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign Transaction</CardTitle>
              <CardDescription>
                Sign a multisig transaction with your key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Transaction Data</Label>
                <textarea
                  className="w-full h-32 p-3 border rounded-md font-mono text-xs"
                  placeholder="Paste the unsigned transaction JSON here..."
                />
              </div>

              <div>
                <Label>Your Signature</Label>
                <Input
                  placeholder="Will be generated after signing"
                  readOnly
                />
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Review the transaction carefully before signing. Your signature will be combined
                  with other signers to execute the transaction.
                </AlertDescription>
              </Alert>

              <Button className="w-full">
                <FileSignature className="h-4 w-4 mr-2" />
                Sign with Connected Wallet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}