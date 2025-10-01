import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { evmdFeemarketParams, type FeemarketParams } from '@/lib/chains/evmd/params';

const feemarketParamsFormSchema = z.object({
  no_base_fee: evmdFeemarketParams.no_base_fee.validation,
  base_fee_change_denominator: evmdFeemarketParams.base_fee_change_denominator.validation,
  elasticity_multiplier: evmdFeemarketParams.elasticity_multiplier.validation,
  base_fee: evmdFeemarketParams.base_fee.validation,
  enable_height: evmdFeemarketParams.enable_height.validation,
  min_gas_price: evmdFeemarketParams.min_gas_price.validation,
  min_gas_multiplier: evmdFeemarketParams.min_gas_multiplier.validation,
});

type FeemarketParamsFormValues = z.infer<typeof feemarketParamsFormSchema>;

interface FeemarketParamsFormProps {
  defaultValues?: Partial<FeemarketParams>;
  onSubmit: (values: FeemarketParams) => void;
}

export function FeemarketParamsForm({ defaultValues, onSubmit }: FeemarketParamsFormProps) {
  const form = useForm<FeemarketParamsFormValues>({
    resolver: zodResolver(feemarketParamsFormSchema),
    defaultValues: {
      no_base_fee: defaultValues?.no_base_fee ?? evmdFeemarketParams.no_base_fee.default,
      base_fee_change_denominator: defaultValues?.base_fee_change_denominator ?? evmdFeemarketParams.base_fee_change_denominator.default,
      elasticity_multiplier: defaultValues?.elasticity_multiplier ?? evmdFeemarketParams.elasticity_multiplier.default,
      base_fee: defaultValues?.base_fee ?? evmdFeemarketParams.base_fee.default,
      enable_height: defaultValues?.enable_height ?? evmdFeemarketParams.enable_height.default,
      min_gas_price: defaultValues?.min_gas_price ?? evmdFeemarketParams.min_gas_price.default,
      min_gas_multiplier: defaultValues?.min_gas_multiplier ?? evmdFeemarketParams.min_gas_multiplier.default,
    },
  });

  const handleSubmit = (values: FeemarketParamsFormValues) => {
    onSubmit(values as FeemarketParams);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Market Module Parameters</CardTitle>
            <CardDescription>
              Configure EIP-1559 fee market settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* No Base Fee */}
            <FormField
              control={form.control}
              name="no_base_fee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Disable Base Fee
                    </FormLabel>
                    <FormDescription>
                      {evmdFeemarketParams.no_base_fee.description}
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

            {/* Base Fee Change Denominator */}
            <FormField
              control={form.control}
              name="base_fee_change_denominator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Fee Change Denominator</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {evmdFeemarketParams.base_fee_change_denominator.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Elasticity Multiplier */}
            <FormField
              control={form.control}
              name="elasticity_multiplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elasticity Multiplier</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {evmdFeemarketParams.elasticity_multiplier.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Base Fee */}
            <FormField
              control={form.control}
              name="base_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Fee (wei)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1000000000" />
                  </FormControl>
                  <FormDescription>
                    {evmdFeemarketParams.base_fee.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Enable Height */}
            <FormField
              control={form.control}
              name="enable_height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enable Height</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {evmdFeemarketParams.enable_height.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Min Gas Price */}
            <FormField
              control={form.control}
              name="min_gas_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Gas Price</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0" />
                  </FormControl>
                  <FormDescription>
                    {evmdFeemarketParams.min_gas_price.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Min Gas Multiplier */}
            <FormField
              control={form.control}
              name="min_gas_multiplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Gas Multiplier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0.5" />
                  </FormControl>
                  <FormDescription>
                    {evmdFeemarketParams.min_gas_multiplier.description}
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
