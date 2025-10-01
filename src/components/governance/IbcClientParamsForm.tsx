import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, X, Info } from 'lucide-react';

interface IbcClientParamsFormProps {
  onSubmit: (data: { allowedClients: string[] }) => void;
  onBack?: () => void;
}

export function IbcClientParamsForm({ onSubmit, onBack }: IbcClientParamsFormProps) {
  const [allowedClients, setAllowedClients] = useState<string[]>(['07-tendermint']);
  const [newClient, setNewClient] = useState('');

  const addClient = () => {
    if (newClient && !allowedClients.includes(newClient)) {
      setAllowedClients([...allowedClients, newClient]);
      setNewClient('');
    }
  };

  const removeClient = (client: string) => {
    setAllowedClients(allowedClients.filter((c) => c !== client));
  };

  const handleSubmit = () => {
    if (allowedClients.length > 0) {
      onSubmit({ allowedClients });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>IBC Client Parameters</CardTitle>
        <CardDescription>
          Configure allowed IBC client types for this chain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            IBC client types define which consensus mechanisms can be used for cross-chain communication.
            Common types: 07-tendermint (Tendermint), 06-solomachine (Solo Machine), 09-localhost (Localhost)
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>Allowed Client Types</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {allowedClients.map((client) => (
              <Badge key={client} variant="secondary" className="gap-1">
                {client}
                <button
                  onClick={() => removeClient(client)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              placeholder="e.g., 07-tendermint"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addClient();
                }
              }}
            />
            <Button type="button" onClick={addClient} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Enter or click + to add a client type
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Common IBC Client Types:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><code className="text-xs">07-tendermint</code> - Tendermint/CometBFT consensus</li>
            <li><code className="text-xs">06-solomachine</code> - Single-key light client</li>
            <li><code className="text-xs">09-localhost</code> - Local loopback client</li>
            <li><code className="text-xs">08-wasm</code> - WASM-based light client</li>
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
            disabled={allowedClients.length === 0}
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
