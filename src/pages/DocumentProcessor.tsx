
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload";
import { AgentDashboard } from "@/components/AgentDashboard";
import { MemoryViewer } from "@/components/MemoryViewer";
import { ProcessingFlow } from "@/components/ProcessingFlow";
import { useToast } from "@/hooks/use-toast";

export interface ProcessedDocument {
  id: string;
  timestamp: string;
  format: 'PDF' | 'JSON' | 'Email';
  intent: string;
  content: string;
  extractedData: Record<string, any>;
  agentUsed: string;
  status: 'processing' | 'completed' | 'error';
}

const DocumentProcessor = () => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<ProcessedDocument | null>(null);
  const { toast } = useToast();

  const handleDocumentProcessed = (doc: ProcessedDocument) => {
    setDocuments(prev => [...prev, doc]);
    setActiveDocument(doc);
    toast({
      title: "Document Processed",
      description: `${doc.format} file classified as ${doc.intent}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Multi-Agent Document Processor</CardTitle>
            <CardDescription className="text-blue-100">
              Upload documents and watch as our AI agents classify, extract, and process your data
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="agents">Agent Dashboard</TabsTrigger>
            <TabsTrigger value="memory">Memory Logs</TabsTrigger>
            <TabsTrigger value="flow">Processing Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload onDocumentProcessed={handleDocumentProcessed} />
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <AgentDashboard documents={documents} activeDocument={activeDocument} />
          </TabsContent>

          <TabsContent value="memory" className="space-y-6">
            <MemoryViewer documents={documents} />
          </TabsContent>

          <TabsContent value="flow" className="space-y-6">
            <ProcessingFlow activeDocument={activeDocument} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentProcessor;
