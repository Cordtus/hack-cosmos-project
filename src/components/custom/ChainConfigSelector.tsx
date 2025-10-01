import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useChainStore, type ChainConfig } from '@/store/chain';
import { Plus, Settings, Check, AlertCircle } from 'lucide-react';

interface ChainConfigSelectorProps {
  value?: string;
  onChange?: (chainId: string) => void;
  label?: string;
  description?: string;
  showAddChain?: boolean;
}

export function ChainConfigSelector({
  value,
  onChange,
  label = 'Select Chain',
  description,
  showAddChain = true,
}: ChainConfigSelectorProps) {
  const { chains, selectedChain, setSelectedChain, addChain } = useChainStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChain, setNewChain] = useState<Partial<ChainConfig>>({
    chainId: '',
    chainName: '',
    rpc: '',
    rest: '',
    bech32Prefix: '',
    coinDenom: '',
    coinMinimalDenom: '',
    coinDecimals: 6,
    gasPrice: '',
  });

  const currentChainId = value || selectedChain?.chainId || '';
  const currentChain = chains.find((c) => c.chainId === currentChainId);

  const handleChainChange = (chainId: string) => {
    const chain = chains.find((c) => c.chainId === chainId);
    if (chain) {
      setSelectedChain(chain);
      onChange?.(chainId);
    }
  };

  const handleAddChain = () => {
    if (!newChain.chainId || !newChain.chainName) {
      return;
    }

    addChain(newChain as ChainConfig);
    setIsAddDialogOpen(false);
    setNewChain({
      chainId: '',
      chainName: '',
      rpc: '',
      rest: '',
      bech32Prefix: '',
      coinDenom: '',
      coinMinimalDenom: '',
      coinDecimals: 6,
      gasPrice: '',
    });
  };

  const isFormValid = Boolean(
    newChain.chainId &&
    newChain.chainName &&
    newChain.rpc &&
    newChain.rest &&
    newChain.bech32Prefix &&
    newChain.coinDenom &&
    newChain.coinMinimalDenom &&
    newChain.gasPrice
  );

  return (
    <div className="space-y-4">
      {label && (
        <Label className="text-base">
          {label}
        </Label>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="flex gap-2">
        <Select value={currentChainId} onValueChange={handleChainChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a chain..." />
          </SelectTrigger>
          <SelectContent>
            {chains.map((chain) => (
              <SelectItem key={chain.chainId} value={chain.chainId}>
                <div className="flex items-center gap-2">
                  <span>{chain.chainName}</span>
                  <Badge variant="outline" className="text-xs">
                    {chain.chainId}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showAddChain && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Custom Chain</DialogTitle>
                <DialogDescription>
                  Configure a custom chain connection
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chainId">Chain ID *</Label>
                    <Input
                      id="chainId"
                      value={newChain.chainId}
                      onChange={(e) => setNewChain({ ...newChain, chainId: e.target.value })}
                      placeholder="cosmoshub-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chainName">Chain Name *</Label>
                    <Input
                      id="chainName"
                      value={newChain.chainName}
                      onChange={(e) => setNewChain({ ...newChain, chainName: e.target.value })}
                      placeholder="Cosmos Hub"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rpc">RPC Endpoint *</Label>
                    <Input
                      id="rpc"
                      value={newChain.rpc}
                      onChange={(e) => setNewChain({ ...newChain, rpc: e.target.value })}
                      placeholder="https://rpc.cosmos.network"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rest">REST Endpoint *</Label>
                    <Input
                      id="rest"
                      value={newChain.rest}
                      onChange={(e) => setNewChain({ ...newChain, rest: e.target.value })}
                      placeholder="https://lcd.cosmos.network"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bech32Prefix">Bech32 Prefix *</Label>
                  <Input
                    id="bech32Prefix"
                    value={newChain.bech32Prefix}
                    onChange={(e) => setNewChain({ ...newChain, bech32Prefix: e.target.value })}
                    placeholder="cosmos"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coinDenom">Coin Denom *</Label>
                    <Input
                      id="coinDenom"
                      value={newChain.coinDenom}
                      onChange={(e) => setNewChain({ ...newChain, coinDenom: e.target.value })}
                      placeholder="ATOM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coinMinimalDenom">Minimal Denom *</Label>
                    <Input
                      id="coinMinimalDenom"
                      value={newChain.coinMinimalDenom}
                      onChange={(e) => setNewChain({ ...newChain, coinMinimalDenom: e.target.value })}
                      placeholder="uatom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coinDecimals">Decimals *</Label>
                    <Input
                      id="coinDecimals"
                      type="number"
                      value={newChain.coinDecimals}
                      onChange={(e) => setNewChain({ ...newChain, coinDecimals: parseInt(e.target.value) })}
                      placeholder="6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gasPrice">Gas Price *</Label>
                  <Input
                    id="gasPrice"
                    value={newChain.gasPrice}
                    onChange={(e) => setNewChain({ ...newChain, gasPrice: e.target.value })}
                    placeholder="0.025uatom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coinGeckoId">CoinGecko ID (optional)</Label>
                  <Input
                    id="coinGeckoId"
                    value={newChain.coinGeckoId || ''}
                    onChange={(e) => setNewChain({ ...newChain, coinGeckoId: e.target.value })}
                    placeholder="cosmos"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddChain} disabled={!isFormValid}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chain
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {currentChain && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Chain Configuration
            </CardTitle>
            <CardDescription>{currentChain.chainName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Chain ID:</span>
                <span className="ml-2 font-mono">{currentChain.chainId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Prefix:</span>
                <span className="ml-2 font-mono">{currentChain.bech32Prefix}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Denom:</span>
                <span className="ml-2 font-mono">{currentChain.coinDenom}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Gas Price:</span>
                <span className="ml-2 font-mono">{currentChain.gasPrice}</span>
              </div>
            </div>
            {currentChain.features && currentChain.features.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-2">
                {currentChain.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
