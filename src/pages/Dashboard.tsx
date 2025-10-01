import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/hooks/useWallet';
import { useChainStore } from '@/store/chain';
import { Link } from 'react-router-dom';
import {
  Vote,
  Send,
  Zap,
  Coins,
  Settings,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function Dashboard() {
  const { isConnected, account } = useWallet();
  const { selectedChain } = useChainStore();

  const quickActions = [
    {
      title: 'Create Proposal',
      description: 'Submit a governance proposal',
      icon: Vote,
      href: '/governance/create',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Send Tokens',
      description: 'Transfer tokens to another address',
      icon: Send,
      href: '/transactions/send',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'VM Module',
      description: 'Query and manage EVM settings',
      icon: Zap,
      href: '/modules/vm',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'ERC20 Tokens',
      description: 'Manage token conversions',
      icon: Coins,
      href: '/modules/erc20',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Chain Orchestrator - Your Cosmos blockchain toolkit
        </p>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your wallet to start interacting with the blockchain
          </AlertDescription>
        </Alert>
      )}

      {isConnected && account && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Connected
                </CardTitle>
                <CardDescription className="mt-2">
                  Chain: <Badge variant="outline">{selectedChain?.chainName}</Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Address:</span>
                <code className="font-mono">{account.address}</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Algorithm:</span>
                <span>{account.algo}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="w-full">
                      Open
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Features Overview */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Create and vote on parameter change proposals with an intuitive wizard interface
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Module Management
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Query and manage VM, ERC20, and Fee Market modules with type-safe forms
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Execute transfers, validator operations, and batch transactions with ease
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
