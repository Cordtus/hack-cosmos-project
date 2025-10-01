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
  TrendingUp,
  FileText,
  Users,
  Layers,
  Database,
  Rocket,
} from 'lucide-react';

export function Dashboard() {
  const { isConnected, account } = useWallet();
  const { selectedChain } = useChainStore();

  const modules = [
    {
      title: 'ERC20 Module',
      description: 'Token bridges & conversions',
      icon: Coins,
      href: '/modules/erc20',
      stats: '3 queries, 6 transactions',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      title: 'VM (EVM) Module',
      description: 'Ethereum Virtual Machine',
      icon: Zap,
      href: '/modules/vm',
      stats: '14 queries, 2 transactions',
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      title: 'Feemarket Module',
      description: 'EIP-1559 gas pricing',
      icon: TrendingUp,
      href: '/modules/feemarket',
      stats: '3 queries, 1 transaction',
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ];

  const tools = [
    {
      title: 'Governance Wizard',
      description: 'Create proposals with guided forms',
      icon: Vote,
      href: '/governance/create',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      title: 'Send Transaction',
      description: 'Transfer tokens between addresses',
      icon: Send,
      href: '/transactions/send',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Proposal List',
      description: 'View active governance proposals',
      icon: FileText,
      href: '/governance/proposals',
      color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Rocket className="h-10 w-10" />
            Chain Orchestrator
          </h1>
          <p className="mt-2 text-lg opacity-90">
            Your comprehensive toolkit for Cosmos blockchain operations
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-transparent to-white/10" />
      </div>

      {/* Connection Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {isConnected && account ? (
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                Wallet Connected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Chain: </span>
                <Badge className="ml-2">{selectedChain?.chainName || 'Not selected'}</Badge>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Address: </span>
                <code className="ml-2 text-xs">{account.address.slice(0, 16)}...</code>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to start interacting with the blockchain
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">RPC: </span>
              <Badge variant="outline" className="ml-2">
                {selectedChain?.rpc || 'Not configured'}
              </Badge>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Explorer */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Layers className="h-6 w-6" />
            Module Explorer
          </h2>
          <Badge variant="outline">
            Explore blockchain modules with interactive queries
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} to={module.href}>
                <Card className="group hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${module.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {module.stats}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                      Explore Module
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tools & Actions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Tools & Actions
          </h2>
          <Badge variant="outline">
            Execute transactions and manage governance
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} to={tool.href}>
                <Card className="group hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                  <CardHeader>
                    <div className={`inline-flex p-3 rounded-lg ${tool.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-4">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                      Open Tool
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Coming Soon */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-cyan-100 dark:bg-cyan-900/30">
                <Send className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />
              </div>
              <div>
                <p className="font-medium">Multi-Send</p>
                <p className="text-sm text-muted-foreground">
                  Send tokens to multiple recipients in one transaction
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-pink-100 dark:bg-pink-900/30">
                <Users className="h-4 w-4 text-pink-700 dark:text-pink-400" />
              </div>
              <div>
                <p className="font-medium">Multisig Manager</p>
                <p className="text-sm text-muted-foreground">
                  Create and manage multisignature wallets and transactions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
