import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, X, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface EvmRegisterErc20FormProps {
  onSubmit: (data: { erc20Addresses: string[] }) => void;
  onBack?: () => void;
}

export function EvmRegisterErc20Form({ onSubmit, onBack }: EvmRegisterErc20FormProps) {
  const [addresses, setAddresses] = useState<string[]>(['']);
  const [currentAddress, setCurrentAddress] = useState('');

  const addAddress = () => {
    if (currentAddress && currentAddress.startsWith('0x')) {
      if (!addresses.includes(currentAddress)) {
        setAddresses([...addresses.filter(a => a !== ''), currentAddress]);
        setCurrentAddress('');
      }
    }
  };

  const removeAddress = (address: string) => {
    setAddresses(addresses.filter((a) => a !== address));
  };

  const isValid = addresses.length > 0 && addresses.every(a => a.startsWith('0x'));

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({ erc20Addresses: addresses.filter(a => a !== '') });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register ERC20 Tokens</CardTitle>
        <CardDescription>
          Register ERC20 token contracts for Cosmos Coin conversion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This proposal registers native ERC20 contracts to enable conversion between ERC20 tokens and Cosmos Coins.
            Only use this when permissionless registration is disabled. Addresses must be valid ERC20 contract addresses.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>ERC20 Contract Addresses</Label>

          {addresses.filter(a => a !== '').length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted/50 rounded-lg">
              {addresses.filter(a => a !== '').map((address) => (
                <Badge key={address} variant="secondary" className="gap-1 font-mono text-xs">
                  {address.slice(0, 10)}...{address.slice(-8)}
                  <button
                    onClick={() => removeAddress(address)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAddress();
                  }
                }}
              />
            </div>
            <Button type="button" onClick={addAddress} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter ERC20 contract address and press Enter or click + to add
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Must be valid ERC20 contract addresses (0x-prefixed)</li>
            <li>Contracts must implement the ERC20 standard</li>
            <li>Contracts should already be deployed on the chain</li>
            <li>Registration enables bidirectional token conversion</li>
          </ul>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} size="lg">
              Back
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            size="lg"
            className="min-w-[200px]"
          >
            Continue to Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
