
export const processJson = async (content: string): Promise<Record<string, any>> => {
  console.log('JSON Agent: Processing structured data...');
  
  try {
    const jsonData = JSON.parse(content);
    
    // Extract common fields and validate structure
    const result = {
      agent: 'JSON Agent',
      validJson: true,
      fieldCount: Object.keys(jsonData).length,
      extractedFields: {},
      anomalies: [],
      timestamp: new Date().toISOString()
    };

    // Extract key business fields
    const businessFields = ['amount', 'total', 'price', 'cost', 'date', 'email', 'name', 'company', 'id'];
    
    for (const field of businessFields) {
      if (jsonData[field] !== undefined) {
        result.extractedFields[field] = jsonData[field];
      }
    }

    // Check for anomalies
    if (jsonData.amount && (isNaN(jsonData.amount) || jsonData.amount < 0)) {
      result.anomalies.push('Invalid amount value');
    }

    if (jsonData.email && !jsonData.email.includes('@')) {
      result.anomalies.push('Invalid email format');
    }

    // Schema validation (simplified)
    const requiredFields = ['id', 'timestamp'];
    const missingFields = requiredFields.filter(field => !jsonData[field]);
    
    if (missingFields.length > 0) {
      result.anomalies.push(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return result;
  } catch (error) {
    return {
      agent: 'JSON Agent',
      validJson: false,
      error: 'Invalid JSON format',
      timestamp: new Date().toISOString()
    };
  }
};
