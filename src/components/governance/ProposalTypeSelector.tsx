import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PROPOSAL_CATEGORIES,
  PROPOSAL_TYPES,
  type ProposalType,
  type ProposalCategory
} from '@/lib/governance/types';
import {
  Settings,
  FileText,
  Wallet,
  ArrowUpCircle,
  XCircle
} from 'lucide-react';

interface ProposalTypeSelectorProps {
  onSelect: (proposalType: ProposalType) => void;
  selectedType?: ProposalType;
}

const categoryIcons: Record<ProposalCategory, any> = {
  [PROPOSAL_CATEGORIES.PARAMETER_CHANGE]: Settings,
  [PROPOSAL_CATEGORIES.TEXT]: FileText,
  [PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND]: Wallet,
  [PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE]: ArrowUpCircle,
  [PROPOSAL_CATEGORIES.CANCEL_UPGRADE]: XCircle,
};

const categoryDescriptions: Record<ProposalCategory, string> = {
  [PROPOSAL_CATEGORIES.PARAMETER_CHANGE]: 'Modify chain parameters and module configurations',
  [PROPOSAL_CATEGORIES.TEXT]: 'Signal governance intent without on-chain execution',
  [PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND]: 'Distribute funds from the community treasury',
  [PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE]: 'Schedule coordinated chain upgrades',
  [PROPOSAL_CATEGORIES.CANCEL_UPGRADE]: 'Cancel pending software upgrades',
};

export function ProposalTypeSelector({ onSelect, selectedType }: ProposalTypeSelectorProps) {
  const proposalsByCategory = Object.values(PROPOSAL_TYPES).reduce((acc, proposal) => {
    if (!acc[proposal.category]) {
      acc[proposal.category] = [];
    }
    acc[proposal.category].push(proposal);
    return acc;
  }, {} as Record<ProposalCategory, ProposalType[]>);

  const categories = Object.keys(proposalsByCategory) as ProposalCategory[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Proposal Type</CardTitle>
        <CardDescription>
          Choose the type of governance proposal you want to create
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={PROPOSAL_CATEGORIES.PARAMETER_CHANGE} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6">
            {categories.map((category) => {
              const Icon = categoryIcons[category];
              return (
                <TabsTrigger key={category} value={category} className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {category.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  {categoryDescriptions[category]}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {proposalsByCategory[category].map((proposalType) => {
                  const isSelected = selectedType?.id === proposalType.id;

                  return (
                    <button
                      key={proposalType.id}
                      onClick={() => onSelect(proposalType)}
                      className={`text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{proposalType.name}</h3>
                        {isSelected && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {proposalType.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {proposalType.requiresMessages && (
                          <Badge variant="outline" className="text-xs">
                            On-Chain Execution
                          </Badge>
                        )}
                        {proposalType.allowsExpedited && (
                          <Badge variant="secondary" className="text-xs">
                            Expedited Allowed
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
