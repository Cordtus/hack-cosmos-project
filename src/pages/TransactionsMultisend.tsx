import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AddressInput } from '@/components/custom/AddressInput';
import { CoinInput } from '@/components/custom/CoinInput';
import { useWalletStore } from '@/store/wallet';
import { useChainStore } from '@/store/chain';
import {
  Plus,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  Upload,
  Users
} from 'lucide-react';

interface Recipient {
  id: string;
  address: string;
  amount: string;
  denom: string;
}

export function TransactionsMultisend() {
  const { isConnected, account } = useWalletStore();
  const { selectedChain } = useChainStore();

  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', address: '', amount: '', denom: selectedChain?.coinMinimalDenom || 'uatom' }
  ]);

  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'broadcasting' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const addRecipient = () => {
    const newRecipient: Recipient = {
      id: Date.now().toString(),
      address: '',
      amount: '',
      denom: selectedChain?.coinMinimalDenom || 'uatom'
    };
    setRecipients([...recipients, newRecipient]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(r => r.id !== id));
    }
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(recipients.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const calculateTotal = () => {
    const totals: Record<string, number> = {};
    recipients.forEach(r => {
      if (r.amount) {
        totals[r.denom] = (totals[r.denom] || 0) + parseFloat(r.amount);
      }
    });
    return totals;
  };

  const exportToCSV = () => {
    const csv = 'Address,Amount,Denom\n' +
      recipients.map(r => `${r.address},${r.amount},${r.denom}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multisend-recipients.csv';
    a.click();
  };

  const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1); // Skip header
      const newRecipients: Recipient[] = lines
        .filter(line => line.trim())
        .map(line => {
          const [address, amount, denom] = line.split(',');
          return {
            id: Date.now().toString() + Math.random(),
            address: address?.trim() || '',
            amount: amount?.trim() || '',
            denom: denom?.trim() || selectedChain?.coinMinimalDenom || 'uatom'
          };
        });
      setRecipients(newRecipients);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    // Validate recipients
    const validRecipients = recipients.filter(r => r.address && r.amount);
    if (validRecipients.length === 0) {
      setError('Please add at least one valid recipient');
      return;
    }

    setTxStatus('signing');
    setError('');

    // Simulate transaction
    setTimeout(() => {
      setTxStatus('broadcasting');
      setTimeout(() => {
        const mockHash = '0x' + Math.random().toString(16).substring(2, 66);
        setTxHash(mockHash);
        setTxStatus('success');
      }, 2000);
    }, 1500);
  };

  const totals = calculateTotal();

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Multi-Send Transaction
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Send tokens to multiple recipients in a single transaction
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
            Batch Transfer
          </Badge>
          <Badge variant="outline">
            {recipients.length} Recipients
          </Badge>
        </div>
      </div>

      {!isConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Required</AlertTitle>
          <AlertDescription>
            Connect your wallet to create multi-send transactions
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recipients</CardTitle>
                  <CardDescription>
                    Add recipient addresses and amounts
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById('csv-import')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                  <input
                    id="csv-import"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={importFromCSV}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportToCSV}
                    disabled={recipients.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recipients.map((recipient, index) => (
                <div key={recipient.id} className="space-y-3">
                  {index > 0 && <Separator />}
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-sm">
                          Recipient {index + 1}
                        </Label>
                        <AddressInput
                          placeholder="cosmos1... or 0x..."
                          value={recipient.address}
                          onChange={(value) => updateRecipient(recipient.id, 'address', value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Amount</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={recipient.amount}
                            onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            value={recipient.denom}
                            onChange={(e) => updateRecipient(recipient.id, 'denom', e.target.value)}
                            className="w-32"
                            placeholder="Denom"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeRecipient(recipient.id)}
                      disabled={recipients.length === 1}
                      className="mt-7"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addRecipient}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recipient
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
              <CardDescription>
                Review before sending
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Total Amount</Label>
                <div className="mt-2 space-y-1">
                  {Object.entries(totals).map(([denom, amount]) => (
                    <div key={denom} className="flex justify-between items-center">
                      <Badge variant="outline">{denom}</Badge>
                      <span className="font-mono text-sm">{amount.toFixed(6)}</span>
                    </div>
                  ))}
                  {Object.keys(totals).length === 0 && (
                    <p className="text-sm text-muted-foreground">No amounts entered</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm text-muted-foreground">Recipients</Label>
                <p className="mt-1 text-2xl font-bold">{recipients.filter(r => r.address).length}</p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm text-muted-foreground">Estimated Fee</Label>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm">Gas: 250,000</span>
                  <Badge variant="secondary">~0.025 ATOM</Badge>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {txStatus === 'success' && txHash && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Transaction Sent!</AlertTitle>
                  <AlertDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs flex-1 truncate">{txHash}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(txHash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={!isConnected || txStatus !== 'idle'}
              >
                {txStatus === 'signing' && 'Signing...'}
                {txStatus === 'broadcasting' && 'Broadcasting...'}
                {txStatus === 'success' && 'Sent!'}
                {txStatus === 'idle' && (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to All Recipients
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• Multi-send saves gas compared to individual transactions</li>
                <li>• You can import/export recipient lists as CSV files</li>
                <li>• All transfers happen in a single atomic transaction</li>
                <li>• Maximum 100 recipients per transaction</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}