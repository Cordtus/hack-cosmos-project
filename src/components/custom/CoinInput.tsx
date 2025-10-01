import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatAmount, parseAmount } from '@/lib/utils/format';
import { AlertCircle } from 'lucide-react';
import { useChainStore } from '@/store/chain';

interface CoinInputProps {
  value: { amount: string; denom: string };
  onChange: (value: { amount: string; denom: string }) => void;
  label?: string;
  placeholder?: string;
  denoms?: Array<{ value: string; label: string; decimals: number }>;
  error?: string;
  required?: boolean;
  showBalance?: boolean;
}

export function CoinInput({
  value,
  onChange,
  label = 'Amount',
  placeholder = '0.00',
  denoms,
  error,
  required = false,
  showBalance = false,
}: CoinInputProps) {
  const { selectedChain } = useChainStore();
  const [displayAmount, setDisplayAmount] = useState('');
  const [selectedDenom, setSelectedDenom] = useState(value.denom || '');

  // Get available denoms from chain config if not provided
  const availableDenoms = denoms || (selectedChain ? [{
    value: selectedChain.coinMinimalDenom,
    label: selectedChain.coinDenom,
    decimals: selectedChain.coinDecimals,
  }] : []);

  const currentDenom = availableDenoms.find((d) => d.value === selectedDenom);
  const decimals = currentDenom?.decimals || 6;

  useEffect(() => {
    if (value.amount && value.amount !== '0') {
      try {
        setDisplayAmount(formatAmount(value.amount, decimals));
      } catch {
        setDisplayAmount('');
      }
    } else {
      setDisplayAmount('');
    }
  }, [value.amount, decimals]);

  useEffect(() => {
    if (value.denom) {
      setSelectedDenom(value.denom);
    }
  }, [value.denom]);

  const handleAmountChange = (input: string) => {
    setDisplayAmount(input);

    if (!input || input === '0') {
      onChange({ amount: '0', denom: selectedDenom });
      return;
    }

    try {
      const baseAmount = parseAmount(input, decimals);
      onChange({ amount: baseAmount, denom: selectedDenom });
    } catch {
      // Invalid input, keep display but don't update base amount
    }
  };

  const handleDenomChange = (denom: string) => {
    setSelectedDenom(denom);
    onChange({ amount: value.amount, denom });
  };

  const isValidAmount = displayAmount && /^\d*\.?\d*$/.test(displayAmount);

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={displayAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={placeholder}
            className={error ? 'border-destructive' : ''}
          />
        </div>

        {availableDenoms.length > 0 && (
          <div className="w-32">
            <Select value={selectedDenom} onValueChange={handleDenomChange}>
              <SelectTrigger>
                <SelectValue placeholder="Denom" />
              </SelectTrigger>
              <SelectContent>
                {availableDenoms.map((denom) => (
                  <SelectItem key={denom.value} value={denom.value}>
                    {denom.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {displayAmount && isValidAmount && (
        <p className="text-xs text-muted-foreground font-mono">
          Base amount: {value.amount} {selectedDenom}
        </p>
      )}

      {showBalance && (
        <p className="text-xs text-muted-foreground">
          Balance: — {currentDenom?.label || selectedDenom}
        </p>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {displayAmount && !isValidAmount && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Amount must be a valid number
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
