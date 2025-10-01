import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Database, Send } from 'lucide-react';

interface MethodInfo {
  name: string;
  type: 'query' | 'transaction';
  description?: string;
  request: string;
  response: string;
}

interface MethodCardProps {
  method: MethodInfo;
}

export const MethodCard: React.FC<MethodCardProps> = ({ method }) => {
  const icon = method.type === 'query' ? <Database className="w-4 h-4" /> : <Send className="w-4 h-4" />;
  const badgeVariant = method.type === 'query' ? 'secondary' : 'default';

  return (
    <Card className="hover:border-primary/30 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{method.name}</CardTitle>
          </div>
          <Badge variant={badgeVariant} className="text-xs">
            {method.type === 'query' ? 'Query' : 'Transaction'}
          </Badge>
        </div>
        {method.description && (
          <CardDescription className="mt-2">{method.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">Request:</span>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{method.request}</code>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium">Response:</span>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{method.response}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodCard;