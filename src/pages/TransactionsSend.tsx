import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AddressInput } from '@/components/custom/AddressInput';
import { CoinInput } from '@/components/custom/CoinInput';
import { useWallet } from '@/hooks/useWallet';
import { useChainStore } from '@/store/chain';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

export function TransactionsSend() {
  const { isConnected, account } = useWallet();
  const { selectedChain } = useChainStore();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState({ amount: '0', denom: selectedChain?.coinMinimalDenom || 'ucosmos' });
  const [memo, setMemo] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);

  const handleSend = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    // Implementation would go here
    console.log('Sending transaction:', { recipient, amount, memo });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send Tokens</h1>
        <p className="text-muted-foreground mt-2">
          Transfer tokens to another address on {selectedChain?.chainName}
        </p>
      </div>

      {!isConnected ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to send transactions.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Send Form */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Enter the recipient and amount to send
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>From</Label>
                <div className="p-3 rounded-md border bg-muted">
                  <code className="text-sm font-mono">{account?.address}</code>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recipient Address</Label>
                <AddressInput
                  value={recipient}
                  onChange={(value) => {
                    setRecipient(value);
                    // Validate the address
                    const isValid = value.startsWith('cosmos1') || value.startsWith('0x');
                    setIsValidAddress(isValid && value.length > 10);
                  }}
                  placeholder="cosmos1... or 0x..."
                />
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <CoinInput
                  value={amount}
                  onChange={setAmount}
                />
              </div>

              <div className="space-y-2">
                <Label>Memo (Optional)</Label>
                <Textarea
                  placeholder="Add a note to your transaction..."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                className="w-full"
                disabled={!isValidAddress || BigInt(amount.amount) === 0n}
                onClick={handleSend}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Transaction
              </Button>
            </CardContent>
          </Card>

          {/* Transaction Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Preview</CardTitle>
              <CardDescription>
                Review your transaction before sending
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge variant="secondary">Ready to Send</Badge>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Recipient</div>
                  {recipient ? (
                    <code className="text-xs font-mono break-all">{recipient}</code>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not specified</span>
                  )}
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Amount</div>
                  {BigInt(amount.amount) > 0n ? (
                    <div className="font-semibold">
                      {(Number(amount.amount) / 1e6).toFixed(6)} {amount.denom.slice(1).toUpperCase()}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not specified</span>
                  )}
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Memo</div>
                  {memo ? (
                    <p className="text-sm">{memo}</p>
                  ) : (
                    <span className="text-sm text-muted-foreground">No memo</span>
                  )}
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated Fee</div>
                  <span className="text-sm">~0.01 {selectedChain?.coinMinimalDenom.slice(1).toUpperCase()}</span>
                </div>
              </div>

              {isValidAddress && BigInt(amount.amount) > 0n && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Transaction is ready to be sent. Review the details and click "Send Transaction" to proceed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}