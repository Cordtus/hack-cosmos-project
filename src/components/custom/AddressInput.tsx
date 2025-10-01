import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isValidCosmosAddress, isValidEvmAddress, cosmosToEvm, evmToCosmos } from '@/lib/utils/address';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  prefix?: string;
  showConversion?: boolean;
  error?: string;
  required?: boolean;
}

export function AddressInput({
  value,
  onChange,
  label = 'Address',
  placeholder = 'Enter cosmos or 0x address',
  prefix,
  showConversion = true,
  error,
  required = false,
}: AddressInputProps) {
  const [addressType, setAddressType] = useState<'cosmos' | 'evm' | 'invalid'>('invalid');
  const [convertedAddress, setConvertedAddress] = useState<string>('');

  useEffect(() => {
    if (!value) {
      setAddressType('invalid');
      setConvertedAddress('');
      return;
    }

    if (isValidCosmosAddress(value, prefix)) {
      setAddressType('cosmos');
      if (showConversion) {
        try {
          setConvertedAddress(cosmosToEvm(value));
        } catch {
          setConvertedAddress('');
        }
      }
    } else if (isValidEvmAddress(value)) {
      setAddressType('evm');
      if (showConversion) {
        try {
          setConvertedAddress(evmToCosmos(value, prefix || 'cosmos'));
        } catch {
          setConvertedAddress('');
        }
      }
    } else {
      setAddressType('invalid');
      setConvertedAddress('');
    }
  }, [value, prefix, showConversion]);

  const isValid = addressType !== 'invalid';
  const showError = value && !isValid;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="address-input">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="space-y-2">
        <div className="relative">
          <Input
            id="address-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={showError || error ? 'border-destructive' : isValid ? 'border-green-500' : ''}
          />
          {value && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>

        {isValid && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {addressType === 'cosmos' ? 'Cosmos (bech32)' : 'EVM (hex)'}
            </Badge>
            {prefix && addressType === 'cosmos' && (
              <Badge variant="secondary" className="text-xs">
                {prefix}
              </Badge>
            )}
          </div>
        )}

        {showConversion && convertedAddress && (
          <Alert>
            <AlertDescription className="text-xs font-mono break-all">
              <span className="font-semibold">
                {addressType === 'cosmos' ? 'EVM format: ' : 'Cosmos format: '}
              </span>
              {convertedAddress}
            </AlertDescription>
          </Alert>
        )}

        {(showError || error) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Invalid address format. Please enter a valid cosmos (bech32) or EVM (0x) address.'}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
