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
  const isQuery = method.type === 'query';
  const icon = isQuery ?
    <Database className="w-4 h-4 text-blue-500" /> :
    <Send className="w-4 h-4 text-purple-500" />;

  const cardBorderClass = isQuery ?
    'hover:border-blue-500/50 hover:shadow-blue-100' :
    'hover:border-purple-500/50 hover:shadow-purple-100';

  const badgeClass = isQuery ?
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';

  return (
    <Card className={`transition-all duration-200 ${cardBorderClass} hover:shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{method.name}</CardTitle>
          </div>
          <Badge className={`text-xs ${badgeClass}`}>
            {isQuery ? 'Query' : 'Transaction'}
          </Badge>
        </div>
        {method.description && (
          <CardDescription className="mt-2 text-xs">{method.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-xs">Req:</span>
            <code className={`text-xs px-1.5 py-0.5 rounded ${
              isQuery ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-purple-50 dark:bg-purple-950/30'
            }`}>{method.request}</code>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-xs">Res:</span>
            <code className={`text-xs px-1.5 py-0.5 rounded ${
              isQuery ? 'bg-green-50 dark:bg-green-950/30' : 'bg-orange-50 dark:bg-orange-950/30'
            }`}>{method.response}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodCard;