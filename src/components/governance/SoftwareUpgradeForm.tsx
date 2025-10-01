import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import type { SoftwareUpgradeProposal } from '@/lib/governance/types';

const softwareUpgradeSchema = z.object({
  name: z.string().min(1, 'Upgrade name is required'),
  height: z.string().min(1, 'Height is required').refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0;
  }, 'Height must be a positive number'),
  info: z.string().min(1, 'Upgrade info is required'),
});

type SoftwareUpgradeFormValues = z.infer<typeof softwareUpgradeSchema>;

interface SoftwareUpgradeFormProps {
  onSubmit: (data: Omit<SoftwareUpgradeProposal, 'metadata' | 'proposalType'>) => void;
  defaultValues?: Partial<SoftwareUpgradeFormValues>;
}

export function SoftwareUpgradeForm({ onSubmit, defaultValues }: SoftwareUpgradeFormProps) {
  const form = useForm<SoftwareUpgradeFormValues>({
    resolver: zodResolver(softwareUpgradeSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      height: defaultValues?.height || '',
      info: defaultValues?.info || '',
    },
  });

  const handleSubmit = (values: SoftwareUpgradeFormValues) => {
    onSubmit({
      name: values.name,
      height: values.height,
      info: values.info,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Software Upgrade Details</CardTitle>
            <CardDescription>
              Configure the chain upgrade parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Critical: Coordinated Upgrade Required</p>
                  <p className="text-sm">
                    Software upgrade proposals halt the chain at the specified height. All validators must upgrade their node software before the chain can resume. Ensure the upgrade binary is tested and available.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upgrade Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="v2.0.0" />
                  </FormControl>
                  <FormDescription>
                    A unique identifier for this upgrade (typically the version number)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upgrade Height</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="1000000"
                    />
                  </FormControl>
                  <FormDescription>
                    The block height at which the chain will halt for the upgrade. Choose a height that gives validators sufficient time to prepare (typically 1-2 weeks).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upgrade Info</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='{"binaries":{"linux/amd64":"https://github.com/org/repo/releases/download/v2.0.0/binary"}}'
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    JSON string containing upgrade information, typically including binary download URLs and checksums. This is used by validators to automatically fetch the new binary.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Best Practices</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Test the upgrade on a testnet first</li>
                    <li>Provide clear upgrade instructions</li>
                    <li>Announce the upgrade well in advance</li>
                    <li>Include rollback procedures in documentation</li>
                    <li>Verify binary checksums in the info field</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Continue to Review
        </Button>
      </form>
    </Form>
  );
}
