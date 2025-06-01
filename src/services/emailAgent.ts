
export const processEmail = async (content: string): Promise<Record<string, any>> => {
  console.log('Email Agent: Processing email content...');
  
  const result = {
    agent: 'Email Agent',
    sender: extractSender(content),
    subject: extractSubject(content),
    intent: classifyEmailIntent(content),
    urgency: classifyUrgency(content),
    keyEntities: extractKeyEntities(content),
    actionItems: extractActionItems(content),
    timestamp: new Date().toISOString()
  };

  return result;
};

const extractSender = (content: string): string => {
  const fromMatch = content.match(/From:\s*(.+?)[\r\n]/i);
  if (fromMatch) return fromMatch[1].trim();
  
  const emailMatch = content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  return emailMatch ? emailMatch[1] : 'Unknown sender';
};

const extractSubject = (content: string): string => {
  const subjectMatch = content.match(/Subject:\s*(.+?)[\r\n]/i);
  return subjectMatch ? subjectMatch[1].trim() : 'No subject';
};

const classifyEmailIntent = (content: string): string => {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('meeting') || contentLower.includes('schedule')) {
    return 'Meeting Request';
  }
  
  if (contentLower.includes('urgent') || contentLower.includes('asap')) {
    return 'Urgent Request';
  }
  
  if (contentLower.includes('follow up') || contentLower.includes('following up')) {
    return 'Follow-up';
  }
  
  if (contentLower.includes('thank') || contentLower.includes('appreciate')) {
    return 'Acknowledgment';
  }
  
  return 'General Communication';
};

const classifyUrgency = (content: string): 'High' | 'Medium' | 'Low' => {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('urgent') || contentLower.includes('asap') || contentLower.includes('immediate')) {
    return 'High';
  }
  
  if (contentLower.includes('soon') || contentLower.includes('priority')) {
    return 'Medium';
  }
  
  return 'Low';
};

const extractKeyEntities = (content: string): string[] => {
  const entities: string[] = [];
  
  // Extract email addresses
  const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emails) entities.push(...emails);
  
  // Extract phone numbers (simple pattern)
  const phones = content.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g);
  if (phones) entities.push(...phones);
  
  // Extract dates (simple pattern)
  const dates = content.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g);
  if (dates) entities.push(...dates);
  
  return entities;
};

const extractActionItems = (content: string): string[] => {
  const actionItems: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const lineLower = line.toLowerCase();
    if (lineLower.includes('please') || lineLower.includes('need to') || lineLower.includes('action required')) {
      actionItems.push(line.trim());
    }
  }
  
  return actionItems.slice(0, 3); // Limit to 3 action items
};
