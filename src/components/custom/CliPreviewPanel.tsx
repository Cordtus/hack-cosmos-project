import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Terminal } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CliPreviewPanelProps {
  command: string;
  description?: string;
  flags?: Record<string, any>;
  examples?: string[];
  title?: string;
}

export function CliPreviewPanel({
  command,
  description,
  flags = {},
  examples = [],
  title = 'CLI Command',
}: CliPreviewPanelProps) {
  const [copied, setCopied] = useState(false);

  const buildCommand = () => {
    let cmd = command;

    Object.entries(flags).forEach(([flag, value]) => {
      if (value === undefined || value === null || value === '') return;

      if (typeof value === 'boolean') {
        if (value) cmd += ` --${flag}`;
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach((v) => {
            cmd += ` --${flag}=${JSON.stringify(v)}`;
          });
        }
      } else if (typeof value === 'object') {
        cmd += ` --${flag}='${JSON.stringify(value)}'`;
      } else {
        cmd += ` --${flag}=${JSON.stringify(value)}`;
      }
    });

    return cmd;
  };

  const fullCommand = buildCommand();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const flagCount = Object.keys(flags).filter((key) => {
    const value = flags[key];
    return value !== undefined && value !== null && value !== '';
  }).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant="outline">{flagCount} flags</Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="command">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="command">Command</TabsTrigger>
            <TabsTrigger value="examples" disabled={examples.length === 0}>
              Examples {examples.length > 0 && `(${examples.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="space-y-4">
            <div className="relative">
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
                wrapLongLines
              >
                {fullCommand}
              </SyntaxHighlighter>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {flagCount > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Active Flags:</p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(flags)
                    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
                    .map(([flag, value]) => (
                      <div
                        key={flag}
                        className="flex items-start gap-2 p-2 bg-muted rounded-md text-sm"
                      >
                        <code className="font-mono font-semibold">--{flag}</code>
                        <span className="text-muted-foreground">=</span>
                        <code className="font-mono flex-1 break-all">
                          {typeof value === 'object'
                            ? JSON.stringify(value, null, 2)
                            : String(value)}
                        </code>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            {examples.map((example, index) => (
              <div key={index}>
                <p className="text-sm font-medium mb-2">Example {index + 1}:</p>
                <SyntaxHighlighter
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                  wrapLongLines
                >
                  {example}
                </SyntaxHighlighter>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <Alert className="mt-4">
          <AlertDescription className="text-xs">
            Run this command in your terminal with the appropriate binary (evmd, gaiad, etc.)
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
