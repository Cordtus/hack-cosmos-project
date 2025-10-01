import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/hooks/useWallet';
import { useChainStore } from '@/store/chain';
import { shortenAddress } from '@/lib/utils/address';
import { Wallet, ChevronDown, LogOut, Network } from 'lucide-react';
import { ChainConfigSelector } from '@/components/custom/ChainConfigSelector';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

export function Header() {
  const { isConnected, account, connect, disconnect, availableWallets } = useWallet();
  const { selectedChain } = useChainStore();
  const [isChainDialogOpen, setIsChainDialogOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <div>
            <h1 className="text-lg font-bold">Chain Orchestrator</h1>
            <p className="text-xs text-muted-foreground">Cosmos Governance & Tools</p>
          </div>
        </div>

        {/* Chain & Wallet */}
        <div className="flex items-center gap-3">
          {/* Chain Selector */}
          <Dialog open={isChainDialogOpen} onOpenChange={setIsChainDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Network className="h-4 w-4 mr-2" />
                {selectedChain?.chainName || 'Select Chain'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Chain Configuration</DialogTitle>
                <DialogDescription>
                  Select or add a custom chain
                </DialogDescription>
              </DialogHeader>
              <ChainConfigSelector />
            </DialogContent>
          </Dialog>

          {/* Wallet */}
          {!isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableWallets.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No wallets detected
                  </DropdownMenuItem>
                ) : (
                  availableWallets.map((wallet) => (
                    <DropdownMenuItem
                      key={wallet}
                      onClick={() => connect(wallet)}
                    >
                      {wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Wallet className="h-4 w-4 mr-2" />
                  {account ? shortenAddress(account.address) : 'Connected'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Connected</p>
                    {account && (
                      <p className="text-xs font-mono text-muted-foreground">
                        {shortenAddress(account.address, 12, 8)}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnect}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
