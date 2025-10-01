import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidCosmosAddress } from '@/lib/utils/address';
import { X, Plus, AlertCircle, Info } from 'lucide-react';

type AccessType = 'ACCESS_TYPE_PERMISSIONLESS' | 'ACCESS_TYPE_RESTRICTED' | 'ACCESS_TYPE_PERMISSIONED';

interface AccessControl {
  access_type: AccessType;
  access_control_list: string[];
}

interface AccessControlValue {
  create: AccessControl;
  call: AccessControl;
}

interface AccessControlEditorProps {
  value: AccessControlValue;
  onChange: (value: AccessControlValue) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

const ACCESS_TYPE_DESCRIPTIONS = {
  ACCESS_TYPE_PERMISSIONLESS: 'Anyone can perform this action',
  ACCESS_TYPE_RESTRICTED: 'Only addresses NOT in the list can perform this action',
  ACCESS_TYPE_PERMISSIONED: 'Only addresses in the list can perform this action',
};

function AccessControlSection({
  title,
  description,
  value,
  onChange,
  prefix,
}: {
  title: string;
  description: string;
  value: AccessControl;
  onChange: (value: AccessControl) => void;
  prefix?: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const addAddress = () => {
    if (!inputValue) return;

    if (!isValidCosmosAddress(inputValue, prefix)) {
      setInputError('Invalid cosmos address');
      return;
    }

    if (value.access_control_list.includes(inputValue)) {
      setInputError('Address already in list');
      return;
    }

    onChange({
      ...value,
      access_control_list: [...value.access_control_list, inputValue],
    });
    setInputValue('');
    setInputError('');
  };

  const removeAddress = (address: string) => {
    onChange({
      ...value,
      access_control_list: value.access_control_list.filter((a) => a !== address),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAddress();
    }
  };

  const needsAddressList = value.access_type !== 'ACCESS_TYPE_PERMISSIONLESS';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Access Type Selection */}
        <div className="space-y-3">
          <Label>Access Type</Label>
          <RadioGroup
            value={value.access_type}
            onValueChange={(val) => onChange({ ...value, access_type: val as AccessType })}
          >
            {(Object.keys(ACCESS_TYPE_DESCRIPTIONS) as AccessType[]).map((type) => (
              <div key={type} className="flex items-start space-x-2">
                <RadioGroupItem value={type} id={`${title}-${type}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`${title}-${type}`} className="font-normal cursor-pointer">
                    <div className="font-medium">
                      {type.replace('ACCESS_TYPE_', '').toLowerCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ACCESS_TYPE_DESCRIPTIONS[type]}
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Address List */}
        {needsAddressList && (
          <div className="space-y-2">
            <Label>
              {value.access_type === 'ACCESS_TYPE_RESTRICTED' ? 'Blocked' : 'Allowed'} Addresses
            </Label>

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setInputError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder={`${prefix || 'cosmos'}1...`}
                className={inputError ? 'border-destructive' : ''}
              />
              <Button type="button" onClick={addAddress} disabled={!inputValue} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {inputError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{inputError}</AlertDescription>
              </Alert>
            )}

            {value.access_control_list.length > 0 && (
              <div className="space-y-1 mt-2">
                {value.access_control_list.map((address) => (
                  <div
                    key={address}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span className="font-mono text-sm flex-1 truncate">{address}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAddress(address)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {value.access_control_list.length === 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No addresses in {value.access_type === 'ACCESS_TYPE_RESTRICTED' ? 'block' : 'allow'} list
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AccessControlEditor({
  value,
  onChange,
  label = 'Access Control',
  error,
  required = false,
}: AccessControlEditorProps) {
  return (
    <div className="space-y-4">
      {label && (
        <Label className="text-base">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <AccessControlSection
          title="Contract Creation"
          description="Control who can deploy EVM contracts"
          value={value.create}
          onChange={(create) => onChange({ ...value, create })}
        />

        <AccessControlSection
          title="Contract Calls"
          description="Control who can call EVM contracts"
          value={value.call}
          onChange={(call) => onChange({ ...value, call })}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
