import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
      {
        title: 'Multisig',
        href: '/transactions/multisig',
        icon: Shield,
        description: 'Multisig wallets',
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

  // Load saved state from localStorage
  const savedState = localStorage.getItem('sidebarState');
  const initialState = savedState ? JSON.parse(savedState) : { isCollapsed: false, width: 240 };

  const [isCollapsed, setIsCollapsed] = useState(initialState.isCollapsed);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(initialState.width);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const minWidth = 60;
  const maxWidth = 320;

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify({
      isCollapsed,
      width: sidebarWidth
    }));
  }, [isCollapsed, sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        if (newWidth < 100) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarWidth(isCollapsed ? 240 : minWidth);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-20 z-40 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "relative border-r bg-muted/40 transition-all duration-300 flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "fixed md:relative inset-y-0 left-0 z-40"
        )}
        style={{
          width: isCollapsed ? `${minWidth}px` : `${sidebarWidth}px`,
        }}
      >
        <div className="flex h-full max-h-screen flex-col">
          {/* Toggle Button */}
          <div className="flex items-center justify-between p-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="ml-auto"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2 py-2">
            <TooltipProvider delayDuration={0}>
              <div className="space-y-2">
                {navGroups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    {!isCollapsed && (
                      <h4 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.label}
                      </h4>
                    )}
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        if (isCollapsed) {
                          return (
                            <Tooltip key={item.href}>
                              <TooltipTrigger asChild>
                                <Link to={item.href}>
                                  <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn(
                                      'w-full justify-center p-2',
                                      isActive && 'bg-secondary'
                                    )}
                                    size="icon"
                                  >
                                    <Icon className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="flex items-center gap-4">
                                <span className="font-medium">{item.title}</span>
                                {item.description && (
                                  <span className="text-muted-foreground text-xs">
                                    {item.description}
                                  </span>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          );
                        }

                        return (
                          <Link key={item.href} to={item.href}>
                            <Button
                              variant={isActive ? 'secondary' : 'ghost'}
                              className={cn(
                                'w-full justify-start text-sm h-9',
                                isActive && 'bg-secondary'
                              )}
                              size="sm"
                            >
                              <Icon className="mr-2 h-4 w-4 shrink-0" />
                              <span className="truncate">{item.title}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                    {!isCollapsed && <Separator className="my-1" />}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </ScrollArea>
        </div>

        {/* Resize Handle */}
        <div
          className={cn(
            "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors",
            "hidden md:block",
            isResizing && "bg-primary/30"
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        />
      </div>
    </>
  );
}
