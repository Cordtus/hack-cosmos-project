import { ProposalWizard } from '@/components/governance';

export function GovernanceCreate() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Governance Proposal</h1>
        <p className="text-muted-foreground mt-2">
          Submit a governance proposal to the chain - text proposals, community pool spending, software upgrades, or parameter changes
        </p>
      </div>

      <ProposalWizard />
    </div>
  );
}
