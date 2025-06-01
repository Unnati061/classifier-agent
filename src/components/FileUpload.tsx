
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Mail, FileJson } from 'lucide-react';
import { ProcessedDocument } from "@/pages/DocumentProcessor";
import { classifyDocument } from "@/services/classifierAgent";

interface FileUploadProps {
  onDocumentProcessed: (doc: ProcessedDocument) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDocumentProcessed }) => {
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      setProcessing(true);
      try {
        const content = await readFileContent(file);
        const processedDoc = await classifyDocument(file.name, content);
        onDocumentProcessed(processedDoc);
      } catch (error) {
        console.error('Error processing file:', error);
      } finally {
        setProcessing(false);
      }
    }
  }, [onDocumentProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/json': ['.json'],
      'text/plain': ['.txt', '.eml'],
      'message/rfc822': ['.eml']
    }
  });

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <Card className="border-2 border-dashed border-blue-300 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`p-8 text-center border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <FileText className="h-8 w-8 text-red-500" />
              <FileJson className="h-8 w-8 text-green-500" />
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports PDF, JSON, and Email (.txt, .eml) files
              </p>
            </div>
            <Button variant="outline" disabled={processing}>
              {processing ? 'Processing...' : 'Choose Files'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
