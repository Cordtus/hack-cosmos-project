import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddressInput } from '@/components/custom/AddressInput';
import { CoinInput } from '@/components/custom/CoinInput';
import { Info } from 'lucide-react';
import type { CommunityPoolSpendProposal } from '@/lib/governance/types';

const communityPoolSpendSchema = z.object({
  recipient: z.string().min(1, 'Recipient address is required'),
  amount: z.object({
    amount: z.string().min(1, 'Amount is required'),
    denom: z.string().min(1, 'Denomination is required'),
  }),
});

type CommunityPoolSpendFormValues = z.infer<typeof communityPoolSpendSchema>;

interface CommunityPoolSpendFormProps {
  onSubmit: (data: Omit<CommunityPoolSpendProposal, 'metadata' | 'proposalType'>) => void;
  defaultValues?: Partial<CommunityPoolSpendFormValues>;
}

export function CommunityPoolSpendForm({ onSubmit, defaultValues }: CommunityPoolSpendFormProps) {
  const form = useForm<CommunityPoolSpendFormValues>({
    resolver: zodResolver(communityPoolSpendSchema),
    defaultValues: {
      recipient: defaultValues?.recipient || '',
      amount: defaultValues?.amount || { amount: '0', denom: 'atest' },
    },
  });

  const handleSubmit = (values: CommunityPoolSpendFormValues) => {
    onSubmit({
      recipient: values.recipient,
      amount: [values.amount],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Community Pool Spend Details</CardTitle>
            <CardDescription>
              Specify the recipient and amount to distribute from the community pool
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The community pool is funded by inflation and transaction fees. Proposals to spend from this pool typically fund ecosystem development, grants, or community initiatives.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <AddressInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="cosmos1..."
                      label=""
                    />
                  </FormControl>
                  <FormDescription>
                    The address that will receive the funds from the community pool
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CoinInput
                      label="Amount to Distribute"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormDescription>
                    The amount of tokens to transfer from the community pool
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Continue to Review
        </Button>
      </form>
    </Form>
  );
}
