import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Info } from 'lucide-react';

interface Preinstall {
  name: string;
  address: string;
  code: string;
}

interface EvmRegisterPreinstallsFormProps {
  onSubmit: (data: { preinstalls: Preinstall[] }) => void;
  onBack?: () => void;
}

export function EvmRegisterPreinstallsForm({ onSubmit, onBack }: EvmRegisterPreinstallsFormProps) {
  const [preinstalls, setPreinstalls] = useState<Preinstall[]>([
    { name: '', address: '', code: '' },
  ]);

  const addPreinstall = () => {
    setPreinstalls([...preinstalls, { name: '', address: '', code: '' }]);
  };

  const removePreinstall = (index: number) => {
    setPreinstalls(preinstalls.filter((_, i) => i !== index));
  };

  const updatePreinstall = (index: number, field: keyof Preinstall, value: string) => {
    const updated = [...preinstalls];
    updated[index][field] = value;
    setPreinstalls(updated);
  };

  const isValid = preinstalls.every((p) => p.name && p.address && p.code);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({ preinstalls });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Preinstalled Contracts</CardTitle>
        <CardDescription>
          Register smart contracts that are preinstalled in the EVM state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Preinstalled contracts are deployed at genesis or through governance. They exist at specific addresses
            with predefined bytecode. Use hex format (0x-prefixed) for addresses and bytecode.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {preinstalls.map((preinstall, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Preinstall #{index + 1}
                  </Label>
                  {preinstalls.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreinstall(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Contract Name *</Label>
                  <Input
                    id={`name-${index}`}
                    value={preinstall.name}
                    onChange={(e) => updatePreinstall(index, 'name', e.target.value)}
                    placeholder="e.g., WEVM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`address-${index}`}>Contract Address *</Label>
                  <Input
                    id={`address-${index}`}
                    value={preinstall.address}
                    onChange={(e) => updatePreinstall(index, 'address', e.target.value)}
                    placeholder="0x..."
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`code-${index}`}>Bytecode (hex) *</Label>
                  <Textarea
                    id={`code-${index}`}
                    value={preinstall.code}
                    onChange={(e) => updatePreinstall(index, 'code', e.target.value)}
                    placeholder="0x60806040..."
                    rows={4}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Full contract bytecode in hexadecimal format (0x-prefixed)
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addPreinstall}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Preinstall
        </Button>

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
