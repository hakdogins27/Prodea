export interface ErrorInfo {
  message: string;
  description?: string;
  type: 'error' | 'warning' | 'info' | 'success';
}

export function mapApiError(status: number, details?: string): ErrorInfo {
  // Use professional "Architectural" language
  
  switch (status) {
    case 429:
      return {
        message: 'Rate Limit Reached',
        description: 'The AI service is temporarily busy. Please wait a minute before trying again.',
        type: 'warning'
      };
    
    case 424:
      return {
        message: 'AI Service Unavailable',
        description: 'We are having trouble connecting to the AI model. Please try again in a moment.',
        type: 'error'
      };

    case 422:
      return {
        message: 'Request Processing Error',
        description: 'The engine could not process your last request. Please try rephrasing it.',
        type: 'warning'
      };

    case 400:
      return {
        message: 'Invalid Request',
        description: details || 'The sent data was not in the correct format for processing.',
        type: 'error'
      };

    case 401:
    case 403:
      return {
        message: 'Access Denied',
        description: 'Your session has expired or you do not have permission to modify this blueprint.',
        type: 'error'
      };

    case 500:
    default:
      return {
        message: 'Core Engine Failure',
        description: 'A system-wide interference was detected. Our engineers have been dispatched.',
        type: 'error'
      };
  }
}
