import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccessControlEditor } from '@/components/custom/AccessControlEditor';
import { PrecompileSelector } from '@/components/custom/PrecompileSelector';
import {
  evmdVmParams,
  evmdErc20Params,
  evmdFeemarketParams,
  type VmParams,
  type Erc20Params,
  type FeemarketParams,
} from '@/lib/chains/evmd/params';
import { Info, Check, Settings } from 'lucide-react';
import type { ParameterSelection } from '@/lib/governance/types';

interface ParameterSelectorProps {
  onSelectionChange: (selections: ParameterSelection[]) => void;
  initialSelections?: ParameterSelection[];
}

type ModuleType = 'vm' | 'erc20' | 'feemarket';

interface ParameterConfig {
  key: string;
  type: string;
  default: any;
  description: string;
  validation: any;
}

const moduleConfigs = {
  vm: {
    name: 'VM Module',
    description: 'EVM virtual machine configuration',
    params: evmdVmParams,
  },
  erc20: {
    name: 'ERC20 Module',
    description: 'ERC20 token module settings',
    params: evmdErc20Params,
  },
  feemarket: {
    name: 'Fee Market Module',
    description: 'Dynamic fee market configuration',
    params: evmdFeemarketParams,
  },
} as const;

export function ParameterSelector({ onSelectionChange, initialSelections = [] }: ParameterSelectorProps) {
  const [selectedParams, setSelectedParams] = useState<Map<string, ParameterSelection>>(
    new Map(initialSelections.map(s => [`${s.module}.${s.parameter}`, s]))
  );

  const isParamSelected = (module: ModuleType, paramKey: string) => {
    return selectedParams.has(`${module}.${paramKey}`);
  };

  const toggleParam = (module: ModuleType, paramKey: string) => {
    const key = `${module}.${paramKey}`;
    const newMap = new Map(selectedParams);

    if (newMap.has(key)) {
      newMap.delete(key);
    } else {
      const moduleParams = moduleConfigs[module].params as Record<string, any>;
      newMap.set(key, {
        module,
        parameter: paramKey,
        value: moduleParams[paramKey].default,
        description: moduleParams[paramKey].description,
      });
    }

    setSelectedParams(newMap);
    onSelectionChange(Array.from(newMap.values()));
  };

  const updateParamValue = (module: ModuleType, paramKey: string, value: any) => {
    const key = `${module}.${paramKey}`;
    const newMap = new Map(selectedParams);
    const existing = newMap.get(key);

    if (existing) {
      newMap.set(key, { ...existing, value });
      setSelectedParams(newMap);
      onSelectionChange(Array.from(newMap.values()));
    }
  };

  const renderParameterInput = (
    module: ModuleType,
    paramKey: string,
    config: ParameterConfig
  ) => {
    const key = `${module}.${paramKey}`;
    const selection = selectedParams.get(key);

    if (!selection) return null;

    switch (config.type) {
      case 'boolean':
        return (
          <Switch
            checked={selection.value}
            onCheckedChange={(checked) => updateParamValue(module, paramKey, checked)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={selection.value}
            onChange={(e) => updateParamValue(module, paramKey, parseInt(e.target.value, 10))}
            className="max-w-xs"
          />
        );

      case 'string':
        return (
          <Input
            value={selection.value}
            onChange={(e) => updateParamValue(module, paramKey, e.target.value)}
            className="max-w-xs"
          />
        );

      case 'array':
        if (paramKey === 'active_static_precompiles') {
          return (
            <PrecompileSelector
              value={selection.value}
              onChange={(val) => updateParamValue(module, paramKey, val)}
              label=""
            />
          );
        }
        if (paramKey === 'extra_eips' || paramKey === 'evm_channels') {
          return (
            <Input
              value={Array.isArray(selection.value) ? selection.value.join(', ') : ''}
              onChange={(e) => {
                const items = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
                const values = paramKey === 'extra_eips'
                  ? items.map(Number).filter((n) => !isNaN(n))
                  : items;
                updateParamValue(module, paramKey, values);
              }}
              placeholder={paramKey === 'extra_eips' ? 'e.g., 3855, 3860' : 'e.g., channel-0, channel-1'}
              className="max-w-md"
            />
          );
        }
        return null;

      case 'object':
        if (paramKey === 'access_control') {
          return (
            <AccessControlEditor
              value={selection.value}
              onChange={(val) => updateParamValue(module, paramKey, val)}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  const renderModule = (module: ModuleType) => {
    const config = moduleConfigs[module];
    const params = Object.entries(config.params) as Array<[string, ParameterConfig]>;
    const selectedCount = params.filter(([key]) => isParamSelected(module, key)).length;

    return (
      <AccordionItem value={module} key={module}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-semibold">{config.name}</div>
                <div className="text-sm text-muted-foreground">{config.description}</div>
              </div>
            </div>
            {selectedCount > 0 && (
              <Badge variant="secondary">
                {selectedCount} selected
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {params.map(([paramKey, paramConfig]) => {
            const isSelected = isParamSelected(module, paramKey);

            return (
              <div
                key={paramKey}
                className={`rounded-lg border p-4 space-y-3 transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`${module}.${paramKey}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleParam(module, paramKey)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <Label
                        htmlFor={`${module}.${paramKey}`}
                        className="font-medium cursor-pointer"
                      >
                        {paramKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {paramConfig.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {paramConfig.description}
                    </p>
                    {isSelected && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">New Value</Label>
                          {renderParameterInput(module, paramKey, paramConfig)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info className="h-3 w-3" />
                          <span>Default: {JSON.stringify(paramConfig.default)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    );
  };

  const totalSelected = selectedParams.size;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Parameters to Update</CardTitle>
            <CardDescription>
              Choose one or more parameters across different modules
            </CardDescription>
          </div>
          {totalSelected > 0 && (
            <Badge variant="default" className="gap-1">
              <Check className="h-3 w-3" />
              {totalSelected} parameter{totalSelected !== 1 ? 's' : ''} selected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalSelected === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Select at least one parameter to create a parameter change proposal. You can update multiple parameters across different modules in a single proposal.
            </AlertDescription>
          </Alert>
        )}

        <Accordion type="multiple" className="w-full">
          {renderModule('vm')}
          {renderModule('erc20')}
          {renderModule('feemarket')}
        </Accordion>
      </CardContent>
    </Card>
  );
}
