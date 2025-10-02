import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  XCircle,
  Network,
  Code,
  MessageSquare
} from 'lucide-react';

interface ProposalTypeDropdownProps {
  onSelect: (proposalType: ProposalType) => void;
  selectedType?: ProposalType;
}

const categoryIcons: Record<ProposalCategory, any> = {
  [PROPOSAL_CATEGORIES.PARAMETER_CHANGE]: Settings,
  [PROPOSAL_CATEGORIES.TEXT]: FileText,
  [PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND]: Wallet,
  [PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE]: ArrowUpCircle,
  [PROPOSAL_CATEGORIES.CANCEL_UPGRADE]: XCircle,
  [PROPOSAL_CATEGORIES.IBC_CLIENT]: Network,
  [PROPOSAL_CATEGORIES.EVM_GOVERNANCE]: Code,
  [PROPOSAL_CATEGORIES.CUSTOM_MESSAGE]: MessageSquare,
};

const categoryLabels: Record<ProposalCategory, string> = {
  [PROPOSAL_CATEGORIES.PARAMETER_CHANGE]: 'Parameter Changes',
  [PROPOSAL_CATEGORIES.TEXT]: 'Text Proposals',
  [PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND]: 'Community Pool',
  [PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE]: 'Software Upgrades',
  [PROPOSAL_CATEGORIES.CANCEL_UPGRADE]: 'Cancel Upgrade',
  [PROPOSAL_CATEGORIES.IBC_CLIENT]: 'IBC Client',
  [PROPOSAL_CATEGORIES.EVM_GOVERNANCE]: 'EVM Governance',
  [PROPOSAL_CATEGORIES.CUSTOM_MESSAGE]: 'Custom Message',
};

export function ProposalTypeDropdown({ onSelect, selectedType }: ProposalTypeDropdownProps) {
  const [open, setOpen] = useState(false);

  const proposals = Object.values(PROPOSAL_TYPES);

  const handleSelect = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
      onSelect(proposal);
      setOpen(false);
    }
  };

  const getProposalIcon = (category: ProposalCategory) => {
    return categoryIcons[category] || Settings;
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Proposal Type</Label>
      <Select
        value={selectedType?.id}
        onValueChange={handleSelect}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className="h-14 text-base">
          <SelectValue placeholder="Select a proposal type..." />
        </SelectTrigger>
        <SelectContent className="max-h-[400px] bg-background z-[100]">
          {proposals.map((proposalType) => {
            const Icon = getProposalIcon(proposalType.category);
            return (
              <SelectItem
                key={proposalType.id}
                value={proposalType.id}
                className="py-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{proposalType.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {proposalType.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedType && (
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
          <div className="flex items-start gap-3">
            {(() => {
              const Icon = categoryIcons[selectedType.category];
              return <Icon className="h-5 w-5 mt-0.5 text-primary" />;
            })()}
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-base">{selectedType.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedType.description}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {categoryLabels[selectedType.category]}
                </Badge>
                {selectedType.requiresMessages && (
                  <Badge variant="outline" className="text-xs">
                    On-Chain Execution
                  </Badge>
                )}
                {selectedType.allowsExpedited && (
                  <Badge variant="secondary" className="text-xs">
                    Expedited Allowed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
