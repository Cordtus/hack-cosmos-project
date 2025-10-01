import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Send, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { AddressInput } from '@/components/custom/AddressInput';
import { CoinInput } from '@/components/custom/CoinInput';
import { useWalletStore } from '@/store/wallet';

interface TransactionField {
  name: string;
  type: 'string' | 'address' | 'number' | 'boolean' | 'array' | 'coin' | 'coins';
  required?: boolean;
  placeholder?: string;
  description?: string;
}

interface TransactionMethod {
  name: string;
  description?: string;
  fields?: TransactionField[];
  governanceOnly?: boolean;
}

interface TransactionInterfaceProps {
  method: TransactionMethod;
  module: string;
}

export const TransactionInterface: React.FC<TransactionInterfaceProps> = ({ method, module }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [txHash, setTxHash] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const { account, isConnected } = useWalletStore();

  const handleSubmit = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setTxHash('');

    // Simulate transaction submission
    setTimeout(() => {
      // Mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
      setTxHash(mockTxHash);
      setLoading(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderField = (field: TransactionField) => {
    switch (field.type) {
      case 'address':
        return (
          <AddressInput
            placeholder={field.placeholder || '0x... or cosmos1...'}
            value={formData[field.name] || ''}
            onChange={(value) => setFormData({ ...formData, [field.name]: value })}
          />
        );
      case 'coin':
        return (
          <CoinInput
            value={{
              denom: formData[field.name]?.denom || '',
              amount: formData[field.name]?.amount || ''
            }}
            onChange={(value) => setFormData({ ...formData, [field.name]: value })}
          />
        );
      case 'coins':
        return (
          <Textarea
            placeholder={field.placeholder || 'e.g., 100uatom,50uosmo'}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            rows={3}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || '0'}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor={field.name}>Enable</Label>
          </div>
        );
      case 'array':
        return (
          <Textarea
            placeholder={field.placeholder || 'Enter values separated by commas'}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            rows={3}
          />
        );
      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder || ''}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{method.name}</CardTitle>
            {method.description && (
              <CardDescription>{method.description}</CardDescription>
            )}
          </div>
          {method.governanceOnly && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
              Governance Only
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Required</AlertTitle>
            <AlertDescription>
              Please connect your wallet to execute transactions.
            </AlertDescription>
          </Alert>
        )}

        {method.fields && method.fields.length > 0 ? (
          <div className="space-y-4">
            {method.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label>
                  {field.name}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              This transaction does not require any parameters.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {txHash && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Transaction Submitted</AlertTitle>
            <AlertDescription>
              <div className="flex items-center justify-between mt-2">
                <code className="text-xs break-all">{txHash}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading || !isConnected}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          {loading ? 'Broadcasting Transaction...' :
           method.governanceOnly ? 'Create Governance Proposal' : 'Execute Transaction'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionInterface;