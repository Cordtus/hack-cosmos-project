import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import type { CustomMessageProposal } from '@/lib/governance/types';

const customMessageSchema = z.object({
  messagesJson: z.string().min(1, 'Messages JSON is required').refine((val) => {
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) return false;
      return parsed.every((msg) =>
        typeof msg === 'object' &&
        msg !== null &&
        typeof msg['@type'] === 'string' &&
        msg['@type'].startsWith('/')
      );
    } catch {
      return false;
    }
  }, 'Must be a valid JSON array of messages with @type fields'),
});

type CustomMessageFormValues = z.infer<typeof customMessageSchema>;

interface CustomMessageFormProps {
  onSubmit: (data: Omit<CustomMessageProposal, 'metadata' | 'proposalType'>) => void;
  defaultValues?: Partial<CustomMessageFormValues>;
}

export function CustomMessageForm({ onSubmit, defaultValues }: CustomMessageFormProps) {
  const [previewMessages, setPreviewMessages] = useState<any[]>([]);

  const form = useForm<CustomMessageFormValues>({
    resolver: zodResolver(customMessageSchema),
    defaultValues: {
      messagesJson: defaultValues?.messagesJson || '',
    },
  });

  const handleSubmit = (values: CustomMessageFormValues) => {
    const messages = JSON.parse(values.messagesJson);
    const formattedMessages = messages.map((msg: any) => ({
      typeUrl: msg['@type'],
      value: msg,
    }));

    onSubmit({
      messages: formattedMessages,
    });
  };

  const handlePreview = () => {
    try {
      const messages = JSON.parse(form.getValues('messagesJson'));
      setPreviewMessages(messages);
    } catch (e) {
      setPreviewMessages([]);
    }
  };

  const exampleJson = `[
  {
    "@type": "/cosmos.bank.v1beta1.MsgSend",
    "from_address": "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
    "to_address": "cosmos1recipient...",
    "amount": [
      {
        "denom": "uatom",
        "amount": "1000000"
      }
    ]
  }
]`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Message Details</CardTitle>
            <CardDescription>
              Define custom message types for advanced governance proposals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Advanced Users Only</p>
                  <p className="text-sm">
                    Custom messages allow submitting any Cosmos SDK message type through governance. Incorrect messages can fail or have unintended consequences. Only use this if you understand the message structure and implications.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="messagesJson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Messages (JSON Array)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={exampleJson}
                      rows={12}
                      className="font-mono text-sm"
                      onChange={(e) => {
                        field.onChange(e);
                        handlePreview();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    A JSON array of Cosmos SDK messages. Each message must have an @type field with the full message type URL (e.g., /cosmos.bank.v1beta1.MsgSend).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewMessages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Detected Messages ({previewMessages.length})</p>
                <div className="space-y-2">
                  {previewMessages.map((msg, idx) => (
                    <div key={idx} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <code className="text-sm text-primary">{msg['@type']}</code>
                        <span className="text-xs text-muted-foreground">Message {idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Common Message Types</p>
                  <ul className="list-disc list-inside space-y-1 text-sm font-mono">
                    <li>/cosmos.bank.v1beta1.MsgSend</li>
                    <li>/cosmos.staking.v1beta1.MsgDelegate</li>
                    <li>/cosmos.gov.v1.MsgUpdateParams</li>
                    <li>/cosmos.distribution.v1beta1.MsgFundCommunityPool</li>
                    <li>/ibc.core.client.v1.MsgUpdateClient</li>
                  </ul>
                  <p className="text-sm mt-2">
                    Authority field is typically required and should be set to the governance module account address.
                  </p>
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
