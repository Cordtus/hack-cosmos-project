import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, FileJson, Terminal, Download } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ProposalJsonPreviewProps {
  proposal: any;
  cliCommand?: string;
  title?: string;
  description?: string;
}

export function ProposalJsonPreview({
  proposal,
  cliCommand,
  title = 'Governance Proposal',
  description,
}: ProposalJsonPreviewProps) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const jsonString = JSON.stringify(proposal, null, 2);

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const copyCli = async () => {
    if (cliCommand) {
      await navigator.clipboard.writeText(cliCommand);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const messageCount = proposal.messages?.length || 0;
  const proposalType = proposal.messages?.[0]?.['@type']?.split('.').pop() || 'Unknown';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{messageCount} message{messageCount !== 1 ? 's' : ''}</Badge>
            <Badge variant="secondary">{proposalType}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="json">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json">
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="cli" disabled={!cliCommand}>
              <Terminal className="h-4 w-4 mr-2" />
              CLI Command
            </TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyJson}>
                {copiedJson ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy JSON
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={downloadJson}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="relative max-h-[600px] overflow-auto">
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {jsonString}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          {cliCommand && (
            <TabsContent value="cli" className="space-y-4">
              <Button size="sm" variant="outline" onClick={copyCli}>
                {copiedCli ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Command
                  </>
                )}
              </Button>

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
                {cliCommand}
              </SyntaxHighlighter>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
