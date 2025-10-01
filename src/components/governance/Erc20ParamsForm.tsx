import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { evmdErc20Params, type Erc20Params } from '@/lib/chains/evmd/params';

const erc20ParamsFormSchema = z.object({
  enable_erc20: evmdErc20Params.enable_erc20.validation,
  permissionless_registration: evmdErc20Params.permissionless_registration.validation,
});

type Erc20ParamsFormValues = z.infer<typeof erc20ParamsFormSchema>;

interface Erc20ParamsFormProps {
  defaultValues?: Partial<Erc20Params>;
  onSubmit: (values: Erc20Params) => void;
}

export function Erc20ParamsForm({ defaultValues, onSubmit }: Erc20ParamsFormProps) {
  const form = useForm<Erc20ParamsFormValues>({
    resolver: zodResolver(erc20ParamsFormSchema),
    defaultValues: {
      enable_erc20: defaultValues?.enable_erc20 ?? evmdErc20Params.enable_erc20.default,
      permissionless_registration: defaultValues?.permissionless_registration ?? evmdErc20Params.permissionless_registration.default,
    },
  });

  const handleSubmit = (values: Erc20ParamsFormValues) => {
    onSubmit(values as Erc20Params);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ERC20 Module Parameters</CardTitle>
            <CardDescription>
              Configure ERC20 token conversion settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable ERC20 */}
            <FormField
              control={form.control}
              name="enable_erc20"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable ERC20 Module
                    </FormLabel>
                    <FormDescription>
                      {evmdErc20Params.enable_erc20.description}
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

            {/* Permissionless Registration */}
            <FormField
              control={form.control}
              name="permissionless_registration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Permissionless Registration
                    </FormLabel>
                    <FormDescription>
                      {evmdErc20Params.permissionless_registration.description}
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
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Create Parameter Change Proposal
        </Button>
      </form>
    </Form>
  );
}
