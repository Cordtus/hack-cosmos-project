import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface TextProposalFormProps {
  onComplete: () => void;
}

export function TextProposalForm({ onComplete }: TextProposalFormProps) {
  // Text proposals only require metadata, which is captured in the main wizard
  // This component just provides information

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">About Text Proposals</p>
            <p>
              Text proposals (also called signaling proposals) are governance votes that don't execute any on-chain changes. They are used to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Gauge community sentiment on a topic</li>
              <li>Signal intent for future development</li>
              <li>Establish governance precedents</li>
              <li>Coordinate off-chain activities</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Only the title and summary you provide in the proposal details will be included.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
