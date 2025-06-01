
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedDocument } from "@/pages/DocumentProcessor";
import { ArrowRight, Upload, Brain, Cog, CheckCircle } from 'lucide-react';

interface ProcessingFlowProps {
  activeDocument: ProcessedDocument | null;
}

export const ProcessingFlow: React.FC<ProcessingFlowProps> = ({ activeDocument }) => {
  const steps = [
    {
      id: 1,
      title: "Document Upload",
      description: "File received and content extracted",
      icon: <Upload className="h-6 w-6" />,
      color: "blue"
    },
    {
      id: 2,
      title: "Classification",
      description: "Format and intent determined by Classifier Agent",
      icon: <Brain className="h-6 w-6" />,
      color: "purple"
    },
    {
      id: 3,
      title: "Agent Processing",
      description: "Routed to specialized agent for data extraction",
      icon: <Cog className="h-6 w-6" />,
      color: "orange"
    },
    {
      id: 4,
      title: "Memory Storage",
      description: "Results logged to shared memory with context",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "green"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Processing Flow Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center space-y-2 flex-1">
                  <div className={`p-4 rounded-full bg-${step.color}-100 text-${step.color}-600`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{step.title}</h3>
                    <p className="text-xs text-gray-500 max-w-32">{step.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Step {step.id}
                  </Badge>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {activeDocument && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Current Document Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Classification Results</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Format:</span>
                    <Badge variant="outline">{activeDocument.format}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Intent:</span>
                    <Badge variant="outline">{activeDocument.intent}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Agent Used:</span>
                    <Badge variant="secondary">{activeDocument.agentUsed}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Processing Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Document uploaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Format classified as {activeDocument.format}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Routed to {activeDocument.agentUsed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activeDocument.status === 'completed' ? 'bg-green-500' : 
                      activeDocument.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm">
                      {activeDocument.status === 'completed' ? 'Processing completed' :
                       activeDocument.status === 'error' ? 'Processing failed' : 'Processing...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
