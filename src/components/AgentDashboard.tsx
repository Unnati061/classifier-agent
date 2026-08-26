
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedDocument } from "@/pages/DocumentProcessor";
import { Bot, FileText, Mail, FileJson, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AgentDashboardProps {
  documents: ProcessedDocument[];
  activeDocument: ProcessedDocument | null;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ documents, activeDocument }) => {
  const getAgentStats = () => {
    const stats = {
      'JSON Agent': { count: 0, success: 0 },
      'Email Agent': { count: 0, success: 0 },
      'PDF Agent': { count: 0, success: 0 }
    };

    documents.forEach(doc => {
      if (stats[doc.agentUsed]) {
        stats[doc.agentUsed].count++;
        if (doc.status === 'completed') {
          stats[doc.agentUsed].success++;
        }
      }
    });

    return stats;
  };

  const stats = getAgentStats();

  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case 'JSON Agent': return <FileJson className="h-6 w-6 text-green-600" />;
      case 'Email Agent': return <Mail className="h-6 w-6 text-blue-600" />;
      case 'PDF Agent': return <FileText className="h-6 w-6 text-red-600" />;
      default: return <Bot className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(stats).map(([agentName, stat]) => (
          <Card key={agentName} className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{agentName}</CardTitle>
              {getAgentIcon(agentName)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">
                {stat.success}/{stat.count} successful
              </p>
              <div className="mt-2">
                <Badge variant={stat.success === stat.count ? "default" : "secondary"}>
                  {stat.count > 0 ? `${Math.round((stat.success / stat.count) * 100)}%` : '0%'} success rate
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeDocument && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(activeDocument.status)}
              Active Processing: {activeDocument.agentUsed}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Format</p>
                <Badge variant="outline">{activeDocument.format}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Intent</p>
                <Badge variant="outline">{activeDocument.intent}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant={activeDocument.status === 'completed' ? 'default' : 'destructive'}>
                  {activeDocument.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Timestamp</p>
                <p className="text-sm">{new Date(activeDocument.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Extracted Data</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify(activeDocument.extractedData, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
