import { ProposalWizard } from '@/components/governance';

export function GovernanceCreate() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Governance Proposal</h1>
        <p className="text-muted-foreground mt-2">
          Submit a parameter change proposal to the chain
        </p>
      </div>

      <ProposalWizard />
    </div>
  );
}
