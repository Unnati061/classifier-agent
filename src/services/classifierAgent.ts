
import { ProcessedDocument } from "@/pages/DocumentProcessor";
import { processJson } from "./jsonAgent";
import { processEmail } from "./emailAgent";
import { processPdf } from "./pdfAgent";

export const classifyDocument = async (fileName: string, content: string): Promise<ProcessedDocument> => {
  const id = Date.now().toString();
  const timestamp = new Date().toISOString();

  // Determine format based on file extension and content
  const format = determineFormat(fileName, content);
  
  // Classify intent based on content analysis
  const intent = await classifyIntent(content, format);

  console.log(`Classifier Agent: Processing ${fileName} as ${format} with intent: ${intent}`);

  // Route to appropriate agent
  let extractedData: Record<string, any> = {};
  let agentUsed = '';

  try {
    switch (format) {
      case 'JSON':
        extractedData = await processJson(content);
        agentUsed = 'JSON Agent';
        break;
      case 'Email':
        extractedData = await processEmail(content);
        agentUsed = 'Email Agent';
        break;
      case 'PDF':
        extractedData = await processPdf(content);
        agentUsed = 'PDF Agent';
        break;
    }

    return {
      id,
      timestamp,
      format,
      intent,
      content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      extractedData,
      agentUsed,
      status: 'completed'
    };
  } catch (error) {
    console.error('Error in document processing:', error);
    return {
      id,
      timestamp,
      format,
      intent,
      content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      extractedData: { error: 'Processing failed' },
      agentUsed: 'Error',
      status: 'error'
    };
  }
};

const determineFormat = (fileName: string, content: string): 'PDF' | 'JSON' | 'Email' => {
  const ext = fileName.toLowerCase().split('.').pop();
  
  if (ext === 'pdf' || content.startsWith('%PDF')) {
    return 'PDF';
  }
  
  if (ext === 'json' || (content.trim().startsWith('{') && content.trim().endsWith('}'))) {
    return 'JSON';
  }
  
  return 'Email';
};

const classifyIntent = async (content: string, format: string): Promise<string> => {
  // Simple keyword-based classification (in real app, use OpenAI)
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('invoice') || contentLower.includes('bill') || contentLower.includes('payment')) {
    return 'Invoice';
  }
  
  if (contentLower.includes('rfq') || contentLower.includes('request for quote') || contentLower.includes('quotation')) {
    return 'RFQ';
  }
  
  if (contentLower.includes('complaint') || contentLower.includes('issue') || contentLower.includes('problem')) {
    return 'Complaint';
  }
  
  if (contentLower.includes('regulation') || contentLower.includes('compliance') || contentLower.includes('policy')) {
    return 'Regulation';
  }
  
  if (contentLower.includes('contract') || contentLower.includes('agreement')) {
    return 'Contract';
  }
  
  return 'General Document';
};
