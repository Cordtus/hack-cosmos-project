import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Vote,
  Send,
  Search,
  Shield,
  Coins,
  Zap,
  FileCode,
  Users,
  Settings,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  description?: string;
}

const navGroups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'General',
    items: [
      {
        title: 'Dashboard',
        href: '/',
        icon: Home,
        description: 'Overview and quick actions',
      },
    ],
  },
  {
    label: 'Governance',
    items: [
      {
        title: 'Proposals',
        href: '/governance/proposals',
        icon: Vote,
        description: 'View and vote on proposals',
      },
      {
        title: 'Create Proposal',
        href: '/governance/create',
        icon: FileCode,
        description: 'Submit new proposal',
      },
    ],
  },
  {
    label: 'Modules',
    items: [
      {
        title: 'VM (EVM)',
        href: '/modules/vm',
        icon: Zap,
        description: 'EVM module queries & txs',
      },
      {
        title: 'ERC20',
        href: '/modules/erc20',
        icon: Coins,
        description: 'Token conversion',
      },
      {
        title: 'Fee Market',
        href: '/modules/feemarket',
        icon: Settings,
        description: 'Gas pricing',
      },
    ],
  },
  {
    label: 'Transactions',
    items: [
      {
        title: 'Send',
        href: '/transactions/send',
        icon: Send,
        description: 'Send tokens',
      },
      {
        title: 'Validator Tools',
        href: '/transactions/validator',
        icon: Shield,
        description: 'Validator operations',
      },
      {
        title: 'Multi-Send',
        href: '/transactions/multisend',
        icon: Users,
        description: 'Batch transactions',
      },
    ],
  },
  {
    label: 'Tools',
    items: [
      {
        title: 'Query Explorer',
        href: '/tools/query',
        icon: Search,
        description: 'Execute queries',
      },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-4">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <h4 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={isActive ? 'secondary' : 'ghost'}
                          className={cn(
                            'w-full justify-start',
                            isActive && 'bg-secondary'
                          )}
                          size="sm"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
