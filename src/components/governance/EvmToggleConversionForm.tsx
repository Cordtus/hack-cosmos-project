import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info } from 'lucide-react';

interface EvmToggleConversionFormProps {
  onSubmit: (data: { token: string }) => void;
  onBack?: () => void;
}

export function EvmToggleConversionForm({ onSubmit, onBack }: EvmToggleConversionFormProps) {
  const [tokenType, setTokenType] = useState<'evm' | 'cosmos'>('evm');
  const [token, setToken] = useState('');

  const isValid = token.length > 0 && (
    (tokenType === 'evm' && token.startsWith('0x')) ||
    (tokenType === 'cosmos' && token.length > 2)
  );

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({ token });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toggle Token Conversion</CardTitle>
        <CardDescription>
          Enable or disable conversion for a specific token pair
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This proposal toggles the conversion status for a token pair. If conversion is currently enabled,
            this will disable it, and vice versa. Provide either an ERC20 contract address or a Cosmos base denomination.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Label>Token Identifier Type</Label>
          <RadioGroup value={tokenType} onValueChange={(v) => setTokenType(v as 'evm' | 'cosmos')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evm" id="evm" />
              <Label htmlFor="evm" className="font-normal cursor-pointer">
                ERC20 Contract Address (0x...)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cosmos" id="cosmos" />
              <Label htmlFor="cosmos" className="font-normal cursor-pointer">
                Cosmos Base Denomination (e.g., uatom, aevmos)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="token">
            {tokenType === 'evm' ? 'ERC20 Contract Address *' : 'Cosmos Denomination *'}
          </Label>
          <Input
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={tokenType === 'evm' ? '0x...' : 'e.g., aevmos, uatom'}
            className={tokenType === 'evm' ? 'font-mono' : ''}
          />
          <p className="text-xs text-muted-foreground">
            {tokenType === 'evm'
              ? 'ERC20 contract address in hexadecimal format'
              : 'Base denomination as registered on the chain (e.g., aevmos for EVMOS)'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">How Toggle Works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Conversion enabled → This proposal disables it</li>
            <li>Conversion disabled → This proposal enables it</li>
            <li>Both ERC20 and Cosmos denom identifiers work for the same pair</li>
            <li>Check current status before submitting</li>
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
