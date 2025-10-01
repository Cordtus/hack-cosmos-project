import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessControlEditor } from '@/components/custom/AccessControlEditor';
import { PrecompileSelector } from '@/components/custom/PrecompileSelector';
import { evmdVmParams, type VmParams } from '@/lib/chains/evmd/params';

const vmParamsFormSchema = z.object({
  evm_denom: evmdVmParams.evm_denom.validation,
  allow_unprotected_txs: evmdVmParams.allow_unprotected_txs.validation,
  extra_eips: evmdVmParams.extra_eips.validation,
  active_static_precompiles: evmdVmParams.active_static_precompiles.validation,
  evm_channels: evmdVmParams.evm_channels.validation,
  access_control: evmdVmParams.access_control.validation,
});

type VmParamsFormValues = z.infer<typeof vmParamsFormSchema>;

interface VmParamsFormProps {
  defaultValues?: Partial<VmParams>;
  onSubmit: (values: VmParams) => void;
}

export function VmParamsForm({ defaultValues, onSubmit }: VmParamsFormProps) {
  const form = useForm<VmParamsFormValues>({
    resolver: zodResolver(vmParamsFormSchema),
    defaultValues: {
      evm_denom: defaultValues?.evm_denom || evmdVmParams.evm_denom.default,
      allow_unprotected_txs: defaultValues?.allow_unprotected_txs || evmdVmParams.allow_unprotected_txs.default,
      extra_eips: defaultValues?.extra_eips || evmdVmParams.extra_eips.default,
      active_static_precompiles: defaultValues?.active_static_precompiles || evmdVmParams.active_static_precompiles.default,
      evm_channels: defaultValues?.evm_channels || evmdVmParams.evm_channels.default,
      access_control: defaultValues?.access_control || evmdVmParams.access_control.default,
    },
  });

  const handleSubmit = (values: VmParamsFormValues) => {
    onSubmit(values as VmParams);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>VM Module Parameters</CardTitle>
            <CardDescription>
              Configure EVM virtual machine settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* EVM Denom */}
            <FormField
              control={form.control}
              name="evm_denom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVM Denomination</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="atest" />
                  </FormControl>
                  <FormDescription>
                    {evmdVmParams.evm_denom.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allow Unprotected Txs */}
            <FormField
              control={form.control}
              name="allow_unprotected_txs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Unprotected Transactions
                    </FormLabel>
                    <FormDescription>
                      {evmdVmParams.allow_unprotected_txs.description}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Extra EIPs */}
            <FormField
              control={form.control}
              name="extra_eips"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra EIPs</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value?.join(', ') || ''}
                      onChange={(e) => {
                        const eips = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map(Number)
                          .filter((n) => !isNaN(n));
                        field.onChange(eips);
                      }}
                      placeholder="e.g., 3855, 3860"
                    />
                  </FormControl>
                  <FormDescription>
                    {evmdVmParams.extra_eips.description} (comma-separated numbers)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Precompiles */}
            <FormField
              control={form.control}
              name="active_static_precompiles"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PrecompileSelector
                      value={field.value}
                      onChange={field.onChange}
                      label="Active Static Precompiles"
                    />
                  </FormControl>
                  <FormDescription>
                    {evmdVmParams.active_static_precompiles.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EVM Channels */}
            <FormField
              control={form.control}
              name="evm_channels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVM IBC Channels</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value?.join(', ') || ''}
                      onChange={(e) => {
                        const channels = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        field.onChange(channels);
                      }}
                      placeholder="e.g., channel-0, channel-1"
                    />
                  </FormControl>
                  <FormDescription>
                    {evmdVmParams.evm_channels.description} (comma-separated)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Access Control */}
            <FormField
              control={form.control}
              name="access_control"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AccessControlEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {evmdVmParams.access_control.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Create Parameter Change Proposal
        </Button>
      </form>
    </Form>
  );
}
