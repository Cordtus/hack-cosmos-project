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
import { ProposalTypeDropdown } from './ProposalTypeDropdown';
import { ParameterSelector } from './ParameterSelector';
import { TextProposalForm } from './TextProposalForm';
import { CommunityPoolSpendForm } from './CommunityPoolSpendForm';
import { SoftwareUpgradeForm } from './SoftwareUpgradeForm';
import { IbcClientParamsForm } from './IbcClientParamsForm';
import { EvmRegisterPreinstallsForm } from './EvmRegisterPreinstallsForm';
import { EvmRegisterErc20Form } from './EvmRegisterErc20Form';
import { EvmToggleConversionForm } from './EvmToggleConversionForm';
import { CustomMessageForm } from './CustomMessageForm';
import { ProposalJsonPreview } from '@/components/custom/ProposalJsonPreview';
import { CoinInput } from '@/components/custom/CoinInput';
import { PROPOSAL_CATEGORIES, type ProposalType, type ParameterSelection, type ProposalMetadata } from '@/lib/governance/types';
import {
  buildParameterChangeMessages,
  buildCommunityPoolSpendMessage,
  buildSoftwareUpgradeMessage,
  buildCancelUpgradeMessage,
  buildIbcClientParamsMessage,
  buildRegisterPreinstallsMessage,
  buildRegisterErc20Message,
  buildToggleConversionMessage,
  buildProposal,
  generateCliCommand,
  exportProposalJson,
} from '@/lib/governance/proposalBuilder';
import {
  generateParameterChangeTitle,
  generateParameterChangeSummary,
  generateCommunitySpendTitle,
  generateCommunitySpendSummary,
  generateSoftwareUpgradeTitle,
  generateSoftwareUpgradeSummary,
  generateIbcClientTitle,
  generateIbcClientSummary,
  generatePreinstallTitle,
  generatePreinstallSummary,
  generateErc20RegistrationTitle,
  generateErc20RegistrationSummary,
  generateToggleConversionTitle,
  generateToggleConversionSummary,
} from '@/lib/governance/proposalGenerator';
import { useChainStore } from '@/store/chain';
import { FileText, Settings, Upload, Send, Info, Check, ChevronRight, ChevronLeft } from 'lucide-react';

type ProposalStep = 'type' | 'configure' | 'details' | 'review' | 'submit';

export function ProposalWizard() {
  const { selectedChain } = useChainStore();
  const [step, setStep] = useState<ProposalStep>('type');
  const [proposalType, setProposalType] = useState<ProposalType | null>(null);
  const [metadata, setMetadata] = useState<ProposalMetadata>({
    title: '',
    summary: '',
    deposit: { amount: '0', denom: selectedChain?.coinMinimalDenom || 'uatom' },
    expedited: false,
    autoVote: false,
  });

  // For parameter change proposals
  const [parameterSelections, setParameterSelections] = useState<ParameterSelection[]>([]);

  // For community pool spend
  const [communitySpendData, setCommunitySpendData] = useState<any>(null);

  // For software upgrade
  const [upgradeData, setUpgradeData] = useState<any>(null);

  // For IBC client params
  const [ibcClientData, setIbcClientData] = useState<any>(null);

  // For EVM governance
  const [evmPreinstallsData, setEvmPreinstallsData] = useState<any>(null);
  const [evmErc20Data, setEvmErc20Data] = useState<any>(null);
  const [evmToggleConversionData, setEvmToggleConversionData] = useState<any>(null);

  // For custom message
  const [customMessageData, setCustomMessageData] = useState<any>(null);

  // For EVM governance sub-type selection
  const [evmSubType, setEvmSubType] = useState<'register_preinstalls' | 'register_erc20' | 'toggle_conversion' | null>(null);

  const steps: Array<{ id: ProposalStep; label: string; icon: any }> = [
    { id: 'type', label: 'Type', icon: Settings },
    { id: 'configure', label: 'Configure', icon: Settings },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'review', label: 'Review', icon: Upload },
    { id: 'submit', label: 'Submit', icon: Send },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceedFromType = proposalType !== null;
  const canProceedFromDetails = metadata.title && metadata.summary && BigInt(metadata.deposit.amount) > 0;

  // Auto-generate title and summary when moving to details step
  const autoGenerateMetadata = () => {
    let title = '';
    let summary = '';

    if (proposalType?.id === 'parameter_change' && parameterSelections.length > 0) {
      title = generateParameterChangeTitle(parameterSelections);
      summary = generateParameterChangeSummary(parameterSelections);
    } else if (proposalType?.id === 'community_pool_spend' && communitySpendData) {
      title = generateCommunitySpendTitle(communitySpendData.recipient, communitySpendData.amount);
      summary = generateCommunitySpendSummary(communitySpendData.recipient, communitySpendData.amount);
    } else if (proposalType?.id === 'software_upgrade' && upgradeData) {
      title = generateSoftwareUpgradeTitle(upgradeData.name, upgradeData.height);
      summary = generateSoftwareUpgradeSummary(upgradeData.name, upgradeData.height, upgradeData.info);
    } else if (proposalType?.id === 'ibc_client_update' && ibcClientData) {
      title = generateIbcClientTitle(ibcClientData.allowedClients);
      summary = generateIbcClientSummary(ibcClientData.allowedClients);
    } else if (proposalType?.id === 'evm_governance' && evmPreinstallsData) {
      title = generatePreinstallTitle(evmPreinstallsData.preinstalls);
      summary = generatePreinstallSummary(evmPreinstallsData.preinstalls);
    } else if (proposalType?.id === 'evm_governance' && evmErc20Data) {
      title = generateErc20RegistrationTitle(evmErc20Data.erc20Addresses);
      summary = generateErc20RegistrationSummary(evmErc20Data.erc20Addresses);
    } else if (proposalType?.id === 'evm_governance' && evmToggleConversionData) {
      title = generateToggleConversionTitle(evmToggleConversionData.token);
      summary = generateToggleConversionSummary(evmToggleConversionData.token);
    }

    if (title && summary) {
      setMetadata(prev => ({
        ...prev,
        title: prev.title || title,
        summary: prev.summary || summary,
      }));
    }
  };
  const canProceedFromConfigure = () => {
    if (proposalType?.id === 'parameter_change') {
      return parameterSelections.length > 0;
    }
    if (proposalType?.id === 'community_pool_spend') {
      return communitySpendData !== null;
    }
    if (proposalType?.id === 'software_upgrade') {
      return upgradeData !== null;
    }
    if (proposalType?.id === 'ibc_client_update') {
      return ibcClientData !== null;
    }
    if (proposalType?.id === 'evm_governance') {
      return evmPreinstallsData !== null || evmErc20Data !== null || evmToggleConversionData !== null;
    }
    if (proposalType?.id === 'text') {
      return true;
    }
    if (proposalType?.id === 'cancel_upgrade') {
      return true;
    }
    if (proposalType?.id === 'custom_message') {
      return customMessageData !== null;
    }
    return false;
  };

  const buildProposalMessages = () => {
    if (!proposalType) return null;

    let messages: any[] = [];

    if (proposalType.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE) {
      messages = buildParameterChangeMessages(parameterSelections);
    } else if (proposalType.category === PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND) {
      messages.push(buildCommunityPoolSpendMessage(communitySpendData.recipient, communitySpendData.amount));
    } else if (proposalType.category === PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE) {
      messages.push(buildSoftwareUpgradeMessage(upgradeData.name, upgradeData.height, upgradeData.info));
    } else if (proposalType.category === PROPOSAL_CATEGORIES.CANCEL_UPGRADE) {
      messages.push(buildCancelUpgradeMessage());
    } else if (proposalType.category === PROPOSAL_CATEGORIES.IBC_CLIENT) {
      messages.push(buildIbcClientParamsMessage(ibcClientData.allowedClients));
    } else if (proposalType.category === PROPOSAL_CATEGORIES.EVM_GOVERNANCE) {
      if (proposalType.id === 'evm_register_preinstalls') {
        messages.push(buildRegisterPreinstallsMessage(evmPreinstallsData.preinstalls));
      } else if (proposalType.id === 'evm_register_erc20') {
        messages.push(buildRegisterErc20Message(evmErc20Data.erc20Addresses));
      } else if (proposalType.id === 'evm_toggle_conversion') {
        messages.push(buildToggleConversionMessage(evmToggleConversionData.token));
      }
    }

    return buildProposal(messages, metadata.title, metadata.summary, metadata.deposit, metadata.expedited);
  };

  const downloadProposalJson = () => {
    const proposal = buildProposalMessages();
    if (!proposal) return;

    const json = exportProposalJson(proposal);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Compact Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Governance Proposal</h1>
          {proposalType && (
            <p className="text-sm text-muted-foreground mt-1">{proposalType.name}</p>
          )}
        </div>
        <Badge variant="outline" className="text-sm">
          Step {currentStepIndex + 1} of {steps.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Step: Proposal Type */}
      {step === 'type' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Proposal Type</CardTitle>
            <CardDescription>
              Select the type of governance action you want to propose
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProposalTypeDropdown
              selectedType={proposalType || undefined}
              onSelect={(type) => setProposalType(type)}
            />

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setStep('configure')}
                disabled={!canProceedFromType}
                size="lg"
                className="min-w-[200px]"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Configure */}
      {step === 'configure' && (
        <div className="space-y-4">
          {proposalType?.id === 'parameter_change' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Configure Parameter Changes</CardTitle>
                  <CardDescription>
                    Select the module and parameters you want to modify
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ParameterSelector
                    onSelectionChange={setParameterSelections}
                    initialSelections={parameterSelections}
                  />
                </CardContent>
              </Card>
              <div className="flex justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('type')}
                  size="lg"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    autoGenerateMetadata();
                    setStep('details');
                  }}
                  disabled={!canProceedFromConfigure()}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Continue to Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {proposalType?.id === 'text' && (
            <>
              <TextProposalForm onComplete={() => setStep('details')} />
              <div className="flex justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('type')}
                  size="lg"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    autoGenerateMetadata();
                    setStep('details');
                  }}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Continue to Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {proposalType?.id === 'community_pool_spend' && (
            <CommunityPoolSpendForm
              onSubmit={(data) => {
                setCommunitySpendData(data);
                // Generate after state is set
                setTimeout(() => {
                  const title = generateCommunitySpendTitle(data.recipient, data.amount);
                  const summary = generateCommunitySpendSummary(data.recipient, data.amount);
                  setMetadata(prev => ({
                    ...prev,
                    title: prev.title || title,
                    summary: prev.summary || summary,
                  }));
                }, 0);
                setStep('details');
              }}
            />
          )}

          {proposalType?.id === 'software_upgrade' && (
            <SoftwareUpgradeForm
              onSubmit={(data) => {
                setUpgradeData(data);
                // Generate after state is set
                setTimeout(() => {
                  const title = generateSoftwareUpgradeTitle(data.name, data.height);
                  const summary = generateSoftwareUpgradeSummary(data.name, data.height, data.info);
                  setMetadata(prev => ({
                    ...prev,
                    title: prev.title || title,
                    summary: prev.summary || summary,
                  }));
                }, 0);
                setStep('details');
              }}
            />
          )}

          {proposalType?.id === 'cancel_upgrade' && (
            <>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This proposal will cancel any pending software upgrade. No additional configuration is required.
                </AlertDescription>
              </Alert>
              <div className="flex justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('type')}
                  size="lg"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    autoGenerateMetadata();
                    setStep('details');
                  }}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Continue to Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {proposalType?.id === 'ibc_client_update' && (
            <IbcClientParamsForm
              onSubmit={(data) => {
                setIbcClientData(data);
                setTimeout(() => {
                  const title = generateIbcClientTitle(data.allowedClients);
                  const summary = generateIbcClientSummary(data.allowedClients);
                  setMetadata(prev => ({
                    ...prev,
                    title: prev.title || title,
                    summary: prev.summary || summary,
                  }));
                }, 0);
                setStep('details');
              }}
              onBack={() => setStep('type')}
            />
          )}

          {proposalType?.id === 'evm_governance' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Select EVM Governance Action</CardTitle>
                  <CardDescription>
                    Choose the type of EVM operation you want to propose
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start text-left"
                      onClick={() => {
                        setEvmSubType('register_preinstalls');
                      }}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold">Register Preinstalled Contracts</div>
                        <div className="text-sm text-muted-foreground">
                          Deploy preinstalled smart contracts to the EVM state
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start text-left"
                      onClick={() => {
                        setEvmSubType('register_erc20');
                      }}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold">Register ERC20 Tokens</div>
                        <div className="text-sm text-muted-foreground">
                          Register ERC20 contracts for Cosmos Coin conversion
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start text-left"
                      onClick={() => {
                        setEvmSubType('toggle_conversion');
                      }}
                    >
                      <div className="space-y-1">
                        <div className="font-semibold">Toggle Token Conversion</div>
                        <div className="text-sm text-muted-foreground">
                          Enable or disable conversion for token pairs
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {evmSubType === 'register_preinstalls' && (
                <EvmRegisterPreinstallsForm
                  onSubmit={(data) => {
                    setEvmPreinstallsData(data);
                    setTimeout(() => {
                      const title = generatePreinstallTitle(data.preinstalls);
                      const summary = generatePreinstallSummary(data.preinstalls);
                      setMetadata(prev => ({
                        ...prev,
                        title: prev.title || title,
                        summary: prev.summary || summary,
                      }));
                    }, 0);
                    setStep('details');
                  }}
                  onBack={() => setEvmSubType(null)}
                />
              )}

              {evmSubType === 'register_erc20' && (
                <EvmRegisterErc20Form
                  onSubmit={(data) => {
                    setEvmErc20Data(data);
                    setTimeout(() => {
                      const title = generateErc20RegistrationTitle(data.erc20Addresses);
                      const summary = generateErc20RegistrationSummary(data.erc20Addresses);
                      setMetadata(prev => ({
                        ...prev,
                        title: prev.title || title,
                        summary: prev.summary || summary,
                      }));
                    }, 0);
                    setStep('details');
                  }}
                  onBack={() => setEvmSubType(null)}
                />
              )}

              {evmSubType === 'toggle_conversion' && (
                <EvmToggleConversionForm
                  onSubmit={(data) => {
                    setEvmToggleConversionData(data);
                    setTimeout(() => {
                      const title = generateToggleConversionTitle(data.token);
                      const summary = generateToggleConversionSummary(data.token);
                      setMetadata(prev => ({
                        ...prev,
                        title: prev.title || title,
                        summary: prev.summary || summary,
                      }));
                    }, 0);
                    setStep('details');
                  }}
                  onBack={() => setEvmSubType(null)}
                />
              )}

              {!evmSubType && (
                <div className="flex justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('type')}
                    size="lg"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              )}
            </div>
          )}

          {proposalType?.id === 'custom_message' && (
            <>
              <CustomMessageForm
                onSubmit={(data) => {
                  setCustomMessageData(data);
                  setStep('details');
                }}
              />
              <div className="flex justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('type')}
                  size="lg"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step: Proposal Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Proposal Details</CardTitle>
            <CardDescription>
              Review and edit the auto-generated proposal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(proposalType?.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE ||
              proposalType?.category === PROPOSAL_CATEGORIES.COMMUNITY_POOL_SPEND ||
              proposalType?.category === PROPOSAL_CATEGORIES.SOFTWARE_UPGRADE ||
              proposalType?.category === PROPOSAL_CATEGORIES.IBC_CLIENT ||
              proposalType?.category === PROPOSAL_CATEGORIES.EVM_GOVERNANCE) && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  The title and summary have been auto-generated based on your configuration. You can edit them as needed before submitting.
                </AlertDescription>
              </Alert>
            )}
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
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="space-y-4">
              <CoinInput
                label="Initial Deposit *"
                value={metadata.deposit}
                onChange={(deposit) => setMetadata({ ...metadata, deposit })}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposalType?.allowsExpedited && (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="expedited" className="text-sm font-medium">
                        Expedited
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Shorter voting period
                      </p>
                    </div>
                    <Switch
                      id="expedited"
                      checked={metadata.expedited}
                      onCheckedChange={(checked) => setMetadata({ ...metadata, expedited: checked })}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between rounded-lg border p-3 border-primary/40 bg-primary/5">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoVote" className="text-sm font-medium">
                      Auto-Vote Yes
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically vote "Yes" after submission
                    </p>
                  </div>
                  <Switch
                    id="autoVote"
                    checked={metadata.autoVote}
                    onCheckedChange={(checked) => setMetadata({ ...metadata, autoVote: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep('configure')}
                size="lg"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep('review')}
                disabled={!canProceedFromDetails}
                size="lg"
                className="min-w-[200px]"
              >
                Review Proposal
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Step: Review */}
      {step === 'review' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Verify your proposal details before submitting to the chain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Section */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{proposalType?.name}</Badge>
                      {metadata.expedited && (
                        <Badge variant="secondary" className="text-xs">Expedited</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{metadata.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{metadata.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t text-sm flex-wrap">
                  <div>
                    <span className="text-muted-foreground">Deposit:</span>{' '}
                    <span className="font-mono font-medium">
                      {metadata.deposit.amount} {metadata.deposit.denom}
                    </span>
                  </div>
                  {proposalType?.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE && (
                    <div>
                      <span className="text-muted-foreground">Parameters:</span>{' '}
                      <span className="font-medium">{parameterSelections.length}</span>
                    </div>
                  )}
                  {metadata.autoVote && (
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">Auto-Vote Enabled</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Parameter Changes Preview (if applicable) */}
              {proposalType?.category === PROPOSAL_CATEGORIES.PARAMETER_CHANGE && parameterSelections.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Parameter Changes ({parameterSelections.length})</Label>
                  <div className="max-h-[200px] overflow-y-auto space-y-2 rounded-lg border p-3">
                    {parameterSelections.map((param, idx) => (
                      <div key={idx} className="text-sm flex items-center justify-between gap-2 py-1">
                        <span className="font-medium">
                          {param.module.toUpperCase()} → {param.parameter}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                          {JSON.stringify(param.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JSON Preview - Collapsible */}
              <ProposalJsonPreview
                proposal={buildProposalMessages()}
                cliCommand={generateCliCommand(buildProposalMessages()!, selectedChain?.chainId || 'cosmos_9001-2')}
                title="Proposal JSON"
                description="Technical details for CLI submission"
              />
            </CardContent>
          </Card>

          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStep('configure')}
              size="lg"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              onClick={() => setStep('submit')}
              size="lg"
              className="min-w-[200px]"
            >
              Submit Proposal
              <ChevronRight className="ml-2 h-4 w-4" />
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

            {metadata.autoVote && (
              <Alert className="border-primary/40 bg-primary/5">
                <Check className="h-4 w-4 text-primary" />
                <AlertDescription>
                  <strong>Auto-Vote Enabled:</strong> After the proposal is submitted successfully, your connected wallet will automatically vote "Yes" on this proposal.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button size="lg" className="w-full h-14 text-base font-semibold">
                <Send className="h-5 w-5 mr-2" />
                {metadata.autoVote ? 'Submit Proposal & Vote Yes' : 'Sign & Submit Proposal'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={downloadProposalJson}
              >
                <Upload className="h-4 w-4 mr-2" />
                Download Proposal JSON
              </Button>
            </div>

            <Separator />

            <Button
              variant="ghost"
              onClick={() => setStep('review')}
              size="lg"
              className="w-full"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
