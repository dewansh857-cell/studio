/**
 * Sarvam AI Configuration
 * Handles environment variables and configuration for Sarvam AI service
 */

export interface SarvamAIConfig {
  apiKey: string;
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const getSarvamAIConfig = (): SarvamAIConfig => {
  const apiKey = process.env.SARVAM_AI_API_KEY;
  const apiUrl =
    process.env.SARVAM_AI_API_URL || 'https://api.sarvam.ai/speech-to-text';
  const timeout = parseInt(process.env.SARVAM_AI_TIMEOUT || '30000', 10);
  const retryAttempts = parseInt(
    process.env.SARVAM_AI_RETRY_ATTEMPTS || '3',
    10
  );
  const retryDelay = parseInt(process.env.SARVAM_AI_RETRY_DELAY || '1000', 10);

  if (!apiKey) {
    throw new Error(
      'SARVAM_AI_API_KEY environment variable is not set. Please configure it before using Sarvam AI service.'
    );
  }

  return {
    apiKey,
    apiUrl,
    timeout,
    retryAttempts,
    retryDelay,
  };
};

export const sarvamAILanguages = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
};
