import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ProposalTypeSelector } from './ProposalTypeSelector';
import { ParameterSelector } from './ParameterSelector';
import { TextProposalForm } from './TextProposalForm';
import { CommunityPoolSpendForm } from './CommunityPoolSpendForm';
import { SoftwareUpgradeForm } from './SoftwareUpgradeForm';
import { ProposalJsonPreview } from '@/components/custom/ProposalJsonPreview';
import { CoinInput } from '@/components/custom/CoinInput';
import { MSG_TYPES, GOVERNANCE_AUTHORITY } from '@/lib/chains/evmd/params';
import { PROPOSAL_CATEGORIES, type ProposalType, type ParameterSelection, type ProposalMetadata } from '@/lib/governance/types';
import { useChainStore } from '@/store/chain';
import { FileText, Settings, Upload, Send, Info, Check } from 'lucide-react';

type ProposalStep = 'type' | 'details' | 'configure' | 'review' | 'submit';

export function ProposalWizard() {
  const { selectedChain } = useChainStore();
  const [step, setStep] = useState<ProposalStep>('type');
  const [proposalType, setProposalType] = useState<ProposalType | null>(null);
  const [metadata, setMetadata] = useState<ProposalMetadata>({
    title: '',
    summary: '',
    deposit: { amount: '0', denom: selectedChain?.coinMinimalDenom || 'uatom' },
    expedited: false,
  });

  // For parameter change proposals
  const [parameterSelections, setParameterSelections] = useState<ParameterSelection[]>([]);

  // For community pool spend
  const [communitySpendData, setCommunitySpendData] = useState<any>(null);

  // For software upgrade
  const [upgradeData, setUpgradeData] = useState<any>(null);

  const steps: Array<{ id: ProposalStep; label: string; icon: any }> = [
    { id: 'type', label: 'Proposal Type', icon: Settings },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'configure', label: 'Configure', icon: Settings },
    { id: 'review', label: 'Review', icon: Upload },
    { id: 'submit', label: 'Submit', icon: Send },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceedFromType = proposalType !== null;
  const canProceedFromDetails = metadata.title && metadata.summary && BigInt(metadata.deposit.amount) > 0;
  const canProceedFromConfigure = () => {
    if (proposalType?.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE) {
      return parameterSelections.length > 0;
    }
    if (proposalType?.category === PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND) {
      return communitySpendData !== null;
    }
    if (proposalType?.category === PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE) {
      return upgradeData !== null;
    }
    if (proposalType?.category === PROPOSAL_CATEGORIES.TEXT) {
      return true;
    }
    return false;
  };

  const buildProposal = () => {
    if (!proposalType) return null;

    let messages: any[] = [];

    if (proposalType.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE) {
      // Group parameters by module
      const paramsByModule = parameterSelections.reduce((acc, param) => {
        if (!acc[param.module]) {
          acc[param.module] = {};
        }
        acc[param.module][param.parameter] = param.value;
        return acc;
      }, {} as Record<string, any>);

      // Create a message for each module
      Object.entries(paramsByModule).forEach(([module, params]) => {
        const msgType =
          module === 'vm'
            ? MSG_TYPES.VM_UPDATE_PARAMS
            : module === 'erc20'
            ? MSG_TYPES.ERC20_UPDATE_PARAMS
            : MSG_TYPES.FEEMARKET_UPDATE_PARAMS;

        messages.push({
          '@type': msgType,
          authority: GOVERNANCE_AUTHORITY,
          params,
        });
      });
    } else if (proposalType.category === PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND) {
      messages.push({
        '@type': '/cosmos.distribution.v1beta1.MsgCommunityPoolSpend',
        authority: GOVERNANCE_AUTHORITY,
        recipient: communitySpendData.recipient,
        amount: communitySpendData.amount,
      });
    } else if (proposalType.category === PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE) {
      messages.push({
        '@type': '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade',
        authority: GOVERNANCE_AUTHORITY,
        plan: {
          name: upgradeData.name,
          height: upgradeData.height,
          info: upgradeData.info,
        },
      });
    } else if (proposalType.category === PROPOSAL_CATEGORIES.CANCEL_UPGRADE) {
      messages.push({
        '@type': '/cosmos.upgrade.v1beta1.MsgCancelUpgrade',
        authority: GOVERNANCE_AUTHORITY,
      });
    }

    return {
      messages,
      metadata: '',
      deposit: [metadata.deposit],
      title: metadata.title,
      summary: metadata.summary,
      expedited: metadata.expedited,
    };
  };

  const buildCliCommand = () => {
    const proposal = buildProposal();
    if (!proposal) return '';

    return `evmd tx gov submit-proposal proposal.json \\
  --from=<your-key> \\
  --chain-id=${selectedChain?.chainId || 'evmos_9001-2'} \\
  --gas=auto \\
  --gas-adjustment=1.5 \\
  --fees=<fee>`;
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Governance Proposal</CardTitle>
              {proposalType && (
                <CardDescription className="mt-1">
                  {proposalType.name}
                </CardDescription>
              )}
            </div>
            <Badge variant="outline">Step {currentStepIndex + 1} of {steps.length}</Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = index < currentStepIndex;

              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step: Proposal Type */}
      {step === 'type' && (
        <div className="space-y-4">
          <ProposalTypeSelector
            selectedType={proposalType || undefined}
            onSelect={(type) => setProposalType(type)}
          />
          <Button
            onClick={() => setStep('details')}
            disabled={!canProceedFromType}
            size="lg"
            className="w-full"
          >
            Next: Proposal Details
          </Button>
        </div>
      )}

      {/* Step: Proposal Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Proposal Details</CardTitle>
            <CardDescription>
              Basic information about your governance proposal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                placeholder={proposalType?.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE
                  ? "Update Module Parameters"
                  : "Governance Proposal Title"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                value={metadata.summary}
                onChange={(e) => setMetadata({ ...metadata, summary: e.target.value })}
                placeholder="Provide a detailed summary of your proposal and its rationale..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <CoinInput
                label="Initial Deposit *"
                value={metadata.deposit}
                onChange={(deposit) => setMetadata({ ...metadata, deposit })}
                required
              />
            </div>

            {proposalType?.allowsExpedited && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="expedited" className="text-base">
                    Expedited Proposal
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Expedited proposals have a shorter voting period but require a higher deposit
                  </p>
                </div>
                <Switch
                  id="expedited"
                  checked={metadata.expedited}
                  onCheckedChange={(checked) => setMetadata({ ...metadata, expedited: checked })}
                />
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The initial deposit must meet the minimum deposit requirement. Additional deposits can be made after submission.
              </AlertDescription>
            </Alert>

            <Separator />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('type')}
                className="flex-1"
              >
                Back: Proposal Type
              </Button>
              <Button
                onClick={() => setStep('configure')}
                disabled={!canProceedFromDetails}
                className="flex-1"
              >
                Next: {proposalType?.category === PROPOSAL_CATEGORIES.TEXT ? 'Review' : 'Configure'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Configure */}
      {step === 'configure' && (
        <div className="space-y-4">
          {proposalType?.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE && (
            <>
              <ParameterSelector
                onSelectionChange={setParameterSelections}
                initialSelections={parameterSelections}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back: Details
                </Button>
                <Button
                  onClick={() => setStep('review')}
                  disabled={!canProceedFromConfigure()}
                  className="flex-1"
                >
                  Next: Review
                </Button>
              </div>
            </>
          )}

          {proposalType?.category === PROPOSAL_CATEGORIES.TEXT && (
            <>
              <TextProposalForm onComplete={() => setStep('review')} />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back: Details
                </Button>
                <Button
                  onClick={() => setStep('review')}
                  className="flex-1"
                >
                  Next: Review
                </Button>
              </div>
            </>
          )}

          {proposalType?.category === PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND && (
            <CommunityPoolSpendForm
              onSubmit={(data) => {
                setCommunitySpendData(data);
                setStep('review');
              }}
            />
          )}

          {proposalType?.category === PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE && (
            <SoftwareUpgradeForm
              onSubmit={(data) => {
                setUpgradeData(data);
                setStep('review');
              }}
            />
          )}

          {proposalType?.category === PROPOSAL_CATEGORIES.CANCEL_UPGRADE && (
            <>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This proposal will cancel any pending software upgrade. No additional configuration is required.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back: Details
                </Button>
                <Button
                  onClick={() => setStep('review')}
                  className="flex-1"
                >
                  Next: Review
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Proposal</CardTitle>
              <CardDescription>
                Verify all details before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Proposal Type</Label>
                  <div className="flex items-center gap-2">
                    <Badge>{proposalType?.name}</Badge>
                    {metadata.expedited && (
                      <Badge variant="secondary">Expedited</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <p className="text-sm font-medium">{metadata.title}</p>
                </div>

                <div className="space-y-2">
                  <Label>Summary</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{metadata.summary}</p>
                </div>

                <div className="space-y-2">
                  <Label>Initial Deposit</Label>
                  <p className="text-sm font-mono">
                    {metadata.deposit.amount} {metadata.deposit.denom}
                  </p>
                </div>

                {proposalType?.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE && parameterSelections.length > 0 && (
                  <div className="space-y-2">
                    <Label>Parameter Changes</Label>
                    <div className="space-y-2">
                      {parameterSelections.map((param, idx) => (
                        <div key={idx} className="rounded-lg border p-3 text-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <p className="font-medium">
                                {param.module.toUpperCase()} → {param.parameter}
                              </p>
                              <p className="text-xs text-muted-foreground">{param.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {typeof param.value}
                            </Badge>
                          </div>
                          <div className="mt-2 p-2 bg-muted/50 rounded font-mono text-xs">
                            {JSON.stringify(param.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <ProposalJsonPreview
                proposal={buildProposal()}
                cliCommand={buildCliCommand()}
                title="Proposal Preview"
                description={proposalType?.description || ''}
              />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('configure')} className="flex-1">
              Back: Edit Configuration
            </Button>
            <Button onClick={() => setStep('submit')} className="flex-1">
              Next: Submit Proposal
            </Button>
          </div>
        </div>
      )}

      {/* Step: Submit */}
      {step === 'submit' && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Proposal</CardTitle>
            <CardDescription>
              Sign and broadcast your governance proposal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your wallet will prompt you to sign and broadcast this transaction. Make sure you have enough tokens to cover the deposit and transaction fees.
              </AlertDescription>
            </Alert>

            <div className="grid gap-2">
              <Button size="lg" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Sign & Submit Proposal
              </Button>

              <Button variant="outline" size="lg" className="w-full">
                Download Proposal JSON
              </Button>
            </div>

            <Separator />

            <Button variant="ghost" onClick={() => setStep('review')} className="w-full">
              Back: Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
