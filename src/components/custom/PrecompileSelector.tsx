import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isValidEvmAddress } from '@/lib/utils/address';
import { X, Plus, AlertCircle } from 'lucide-react';

interface PrecompileSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

const KNOWN_PRECOMPILES = [
  { address: '0x0000000000000000000000000000000000000001', name: 'ECRecover' },
  { address: '0x0000000000000000000000000000000000000002', name: 'SHA256' },
  { address: '0x0000000000000000000000000000000000000003', name: 'RIPEMD160' },
  { address: '0x0000000000000000000000000000000000000004', name: 'Identity' },
  { address: '0x0000000000000000000000000000000000000005', name: 'ModExp' },
  { address: '0x0000000000000000000000000000000000000006', name: 'BN256Add' },
  { address: '0x0000000000000000000000000000000000000007', name: 'BN256Mul' },
  { address: '0x0000000000000000000000000000000000000008', name: 'BN256Pairing' },
  { address: '0x0000000000000000000000000000000000000009', name: 'Blake2F' },
];

export function PrecompileSelector({
  value,
  onChange,
  label = 'Active Precompiles',
  error,
  required = false,
}: PrecompileSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const addPrecompile = (address: string) => {
    const normalized = address.toLowerCase();

    if (!isValidEvmAddress(normalized)) {
      setInputError('Invalid EVM address');
      return;
    }

    if (value.includes(normalized)) {
      setInputError('Precompile already added');
      return;
    }

    onChange([...value, normalized].sort());
    setInputValue('');
    setInputError('');
  };

  const removePrecompile = (address: string) => {
    onChange(value.filter((a) => a !== address));
  };

  const toggleKnownPrecompile = (address: string) => {
    const normalized = address.toLowerCase();
    if (value.includes(normalized)) {
      removePrecompile(normalized);
    } else {
      addPrecompile(normalized);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue) {
        addPrecompile(inputValue);
      }
    }
  };

  const getPrecompileName = (address: string) => {
    return KNOWN_PRECOMPILES.find((p) => p.address.toLowerCase() === address.toLowerCase())?.name;
  };

  return (
    <div className="space-y-4">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Quick select known precompiles */}
      <div>
        <Label className="text-sm text-muted-foreground mb-2">Known Precompiles</Label>
        <div className="flex flex-wrap gap-2">
          {KNOWN_PRECOMPILES.map((precompile) => {
            const isSelected = value.includes(precompile.address.toLowerCase());
            return (
              <Badge
                key={precompile.address}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleKnownPrecompile(precompile.address)}
              >
                {precompile.name}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Custom address input */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Custom Address</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="0x..."
            className={inputError ? 'border-destructive' : ''}
          />
          <Button
            type="button"
            onClick={() => addPrecompile(inputValue)}
            disabled={!inputValue}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {inputError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{inputError}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Selected precompiles */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Selected ({value.length})
          </Label>
          <div className="space-y-1">
            {value.map((address) => {
              const name = getPrecompileName(address);
              return (
                <div
                  key={address}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex-1 font-mono text-sm">
                    {name && <span className="font-semibold mr-2">{name}:</span>}
                    {address}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePrecompile(address)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
