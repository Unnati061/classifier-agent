
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedDocument } from "@/pages/DocumentProcessor";
import { Database, Clock, FileText } from 'lucide-react';

interface MemoryViewerProps {
  documents: ProcessedDocument[];
}

export const MemoryViewer: React.FC<MemoryViewerProps> = ({ documents }) => {
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Shared Memory Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
              <p className="text-sm text-gray-500">Total Documents</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-500">Successfully Processed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {documents.filter(d => d.status === 'error').length}
              </div>
              <p className="text-sm text-gray-500">Processing Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedDocuments.map((doc) => (
          <Card key={doc.id} className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{doc.format}</Badge>
                      <Badge variant="secondary">{doc.intent}</Badge>
                      <Badge variant={doc.status === 'completed' ? 'default' : 'destructive'}>
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Processed by {doc.agentUsed}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {new Date(doc.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Content Preview</p>
                  <div className="bg-gray-50 p-3 rounded text-xs max-h-20 overflow-auto">
                    {doc.content}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Extracted Data</p>
                  <div className="bg-gray-50 p-3 rounded text-xs max-h-20 overflow-auto">
                    <pre>{JSON.stringify(doc.extractedData, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {documents.length === 0 && (
          <Card className="bg-gray-50">
            <CardContent className="pt-6 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents processed yet. Upload a file to see memory logs.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
