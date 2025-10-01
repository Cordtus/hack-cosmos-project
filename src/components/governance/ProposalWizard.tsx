import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VmParamsForm } from './VmParamsForm';
import { Erc20ParamsForm } from './Erc20ParamsForm';
import { FeemarketParamsForm } from './FeemarketParamsForm';
import { ProposalJsonPreview } from '@/components/custom/ProposalJsonPreview';
import { CoinInput } from '@/components/custom/CoinInput';
import { MSG_TYPES, GOVERNANCE_AUTHORITY, type VmParams, type Erc20Params, type FeemarketParams } from '@/lib/chains/evmd/params';
import { useChainStore } from '@/store/chain';
import { FileText, Settings, Upload, Send, Info } from 'lucide-react';

type ProposalStep = 'details' | 'parameters' | 'review' | 'submit';
type ModuleType = 'vm' | 'erc20' | 'feemarket';

interface ProposalMetadata {
  title: string;
  summary: string;
  deposit: { amount: string; denom: string };
  expedited: boolean;
}

export function ProposalWizard() {
  const { selectedChain } = useChainStore();
  const [step, setStep] = useState<ProposalStep>('details');
  const [selectedModule, setSelectedModule] = useState<ModuleType>('vm');
  const [metadata, setMetadata] = useState<ProposalMetadata>({
    title: '',
    summary: '',
    deposit: { amount: '0', denom: selectedChain?.coinMinimalDenom || 'uatom' },
    expedited: false,
  });
  const [params, setParams] = useState<VmParams | Erc20Params | FeemarketParams | null>(null);

  const steps: Array<{ id: ProposalStep; label: string; icon: any }> = [
    { id: 'details', label: 'Proposal Details', icon: FileText },
    { id: 'parameters', label: 'Parameters', icon: Settings },
    { id: 'review', label: 'Review', icon: Upload },
    { id: 'submit', label: 'Submit', icon: Send },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceedFromDetails = metadata.title && metadata.summary && BigInt(metadata.deposit.amount) > 0;
  const canProceedFromParams = params !== null;

  const buildProposal = () => {
    if (!params) return null;

    const msgType =
      selectedModule === 'vm'
        ? MSG_TYPES.VM_UPDATE_PARAMS
        : selectedModule === 'erc20'
        ? MSG_TYPES.ERC20_UPDATE_PARAMS
        : MSG_TYPES.FEEMARKET_UPDATE_PARAMS;

    return {
      messages: [
        {
          '@type': msgType,
          authority: GOVERNANCE_AUTHORITY,
          params,
        },
      ],
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
            <CardTitle>Create Governance Proposal</CardTitle>
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
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
                placeholder="Update VM Parameters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                value={metadata.summary}
                onChange={(e) => setMetadata({ ...metadata, summary: e.target.value })}
                placeholder="This proposal updates the VM module parameters to..."
                rows={4}
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

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The initial deposit must meet the minimum deposit requirement. Additional deposits can be made after submission.
              </AlertDescription>
            </Alert>

            <Separator />

            <Button
              onClick={() => setStep('parameters')}
              disabled={!canProceedFromDetails}
              className="w-full"
            >
              Next: Configure Parameters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Parameters */}
      {step === 'parameters' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Module</CardTitle>
              <CardDescription>
                Choose which module parameters to update
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedModule} onValueChange={(val) => setSelectedModule(val as ModuleType)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="vm">VM Module</TabsTrigger>
                  <TabsTrigger value="erc20">ERC20 Module</TabsTrigger>
                  <TabsTrigger value="feemarket">Fee Market</TabsTrigger>
                </TabsList>

                <TabsContent value="vm" className="mt-6">
                  <VmParamsForm
                    onSubmit={(values) => {
                      setParams(values);
                      setStep('review');
                    }}
                  />
                </TabsContent>

                <TabsContent value="erc20" className="mt-6">
                  <Erc20ParamsForm
                    onSubmit={(values) => {
                      setParams(values);
                      setStep('review');
                    }}
                  />
                </TabsContent>

                <TabsContent value="feemarket" className="mt-6">
                  <FeemarketParamsForm
                    onSubmit={(values) => {
                      setParams(values);
                      setStep('review');
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={() => setStep('details')} className="w-full">
            Back: Proposal Details
          </Button>
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
              <div className="space-y-2">
                <Label>Title</Label>
                <p className="text-sm">{metadata.title}</p>
              </div>

              <div className="space-y-2">
                <Label>Summary</Label>
                <p className="text-sm text-muted-foreground">{metadata.summary}</p>
              </div>

              <div className="space-y-2">
                <Label>Initial Deposit</Label>
                <p className="text-sm font-mono">
                  {metadata.deposit.amount} {metadata.deposit.denom}
                </p>
              </div>

              <Separator />

              <ProposalJsonPreview
                proposal={buildProposal()}
                cliCommand={buildCliCommand()}
                title="Proposal Preview"
                description={`${selectedModule.toUpperCase()} module parameter update`}
              />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('parameters')} className="flex-1">
              Back: Edit Parameters
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
