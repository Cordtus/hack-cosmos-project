import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Play, Copy, CheckCircle } from 'lucide-react';
import { AddressInput } from '@/components/custom/AddressInput';

interface QueryField {
  name: string;
  type: 'string' | 'address' | 'number' | 'boolean' | 'array';
  required?: boolean;
  placeholder?: string;
  description?: string;
}

interface QueryMethod {
  name: string;
  description?: string;
  fields?: QueryField[];
  mockResponse?: any;
}

interface QueryInterfaceProps {
  method: QueryMethod;
  module: string;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({ method, module }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockResponse = method.mockResponse || {
        success: true,
        data: `Mock response for ${module}.${method.name}`,
        params: formData
      };
      setResponse(JSON.stringify(mockResponse, null, 2));
      setLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderField = (field: QueryField) => {
    switch (field.type) {
      case 'address':
        return (
          <AddressInput
            placeholder={field.placeholder || '0x... or cosmos1...'}
            value={formData[field.name] || ''}
            onChange={(value) => setFormData({ ...formData, [field.name]: value })}
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
        <CardTitle className="text-lg">{method.name}</CardTitle>
        {method.description && (
          <CardDescription>{method.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
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
              This query does not require any parameters.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          {loading ? 'Running Query...' : 'Execute Query'}
        </Button>

        {response && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Response</Label>
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
            <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre>{response}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryInterface;