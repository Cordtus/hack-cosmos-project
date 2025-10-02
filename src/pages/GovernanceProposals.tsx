import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpRight, Vote, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  status: 'voting_period' | 'deposit_period' | 'passed' | 'rejected' | 'failed';
  votingEnd: string;
  totalDeposit: string;
}

export function GovernanceProposals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API calls
  const proposals: Proposal[] = [
    {
      id: '100',
      title: 'Update VM Module Parameters',
      status: 'voting_period',
      votingEnd: '2024-12-25T12:00:00Z',
      totalDeposit: '1000 ATOM',
    },
    {
      id: '99',
      title: 'Enable New ERC20 Token Pair',
      status: 'passed',
      votingEnd: '2024-12-20T12:00:00Z',
      totalDeposit: '500 ATOM',
    },
  ];

  const getStatusBadge = (status: Proposal['status']) => {
    const variants: Record<Proposal['status'], { variant: any; icon: any; label: string }> = {
      voting_period: { variant: 'default', icon: Vote, label: 'Voting' },
      deposit_period: { variant: 'secondary', icon: Clock, label: 'Deposit' },
      passed: { variant: 'default', icon: CheckCircle, label: 'Passed' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      failed: { variant: 'destructive', icon: XCircle, label: 'Failed' },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredProposals = proposals.filter(proposal => {
    if (statusFilter !== 'all' && proposal.status !== statusFilter) {
      return false;
    }
    if (searchQuery && !proposal.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Governance Proposals</h1>
        <p className="text-muted-foreground mt-2">
          View and vote on active governance proposals
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Proposals</SelectItem>
                <SelectItem value="voting_period">Voting Period</SelectItem>
                <SelectItem value="deposit_period">Deposit Period</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Proposals</CardTitle>
            <Link to="/governance/create">
              <Button>
                Create Proposal
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProposals.length === 0 ? (
            <Alert>
              <AlertDescription>
                No proposals found matching your filters.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Deposit</TableHead>
                  <TableHead>Voting End</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-mono">#{proposal.id}</TableCell>
                    <TableCell className="font-medium">{proposal.title}</TableCell>
                    <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                    <TableCell>{proposal.totalDeposit}</TableCell>
                    <TableCell>
                      {new Date(proposal.votingEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}