import axios, { AxiosError } from 'axios';

interface SarvamAIConfig {
  apiKey: string;
  apiUrl?: string;
}

interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  error?: string;
  statusCode?: number;
}

interface SarvamAIResponse {
  success: boolean;
  message?: string;
  transcript?: string;
  error?: string;
}

export class SarvamAIService {
  private apiKey: string;
  private apiUrl: string;
  private axiosInstance;

  constructor(config: SarvamAIConfig) {
    if (!config.apiKey) {
      throw new Error('Sarvam AI API key is required');
    }
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || 'https://api.sarvam.ai/speech-to-text';
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Transcribe audio file to text using Sarvam AI
   * @param audioBuffer - Audio file buffer
   * @param language - Language code (e.g., 'hi', 'en', 'ta', 'te', 'kn', 'ml')
   * @returns Transcription result
   */
  async transcribeAudio(
    audioBuffer: Buffer,
    language: string = 'en'
  ): Promise<TranscriptionResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', new Blob([audioBuffer]), 'audio.wav');
      formData.append('language_code', language);

      const response = await this.axiosInstance.post<SarvamAIResponse>(
        '/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        return {
          success: true,
          transcription: response.data.transcript || response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.error || 'Transcription failed',
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.message || 'Failed to transcribe audio',
        statusCode: axiosError.response?.status,
      };
    }
  }

  /**
   * Transcribe audio from URL
   * @param audioUrl - URL of the audio file
   * @param language - Language code
   * @returns Transcription result
   */
  async transcribeFromUrl(
    audioUrl: string,
    language: string = 'en'
  ): Promise<TranscriptionResponse> {
    try {
      const response = await this.axiosInstance.post<SarvamAIResponse>(
        '/',
        {
          audio_url: audioUrl,
          language_code: language,
        }
      );

      if (response.data.success) {
        return {
          success: true,
          transcription: response.data.transcript || response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.error || 'Transcription failed',
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.message || 'Failed to transcribe audio from URL',
        statusCode: axiosError.response?.status,
      };
    }
  }

  /**
   * Get supported languages
   * @returns List of supported language codes
   */
  getSupportedLanguages(): string[] {
    return ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'gu', 'mr', 'bn', 'ur', 'pa'];
  }
}

// Singleton instance
let sarvamAIInstance: SarvamAIService | null = null;

/**
 * Initialize Sarvam AI service
 * @param apiKey - API key (defaults to SARVAM_AI_API_KEY env var)
 * @param apiUrl - API URL (defaults to SARVAM_AI_API_URL env var)
 */
export function initializeSarvamAI(
  apiKey?: string,
  apiUrl?: string
): SarvamAIService {
  const key = apiKey || process.env.SARVAM_AI_API_KEY;
  const url = apiUrl || process.env.SARVAM_AI_API_URL;

  if (!key) {
    throw new Error(
      'Sarvam AI API key not provided. Set SARVAM_AI_API_KEY environment variable.'
    );
  }

  sarvamAIInstance = new SarvamAIService({
    apiKey: key,
    apiUrl: url,
  });

  return sarvamAIInstance;
}

/**
 * Get Sarvam AI service instance
 */
export function getSarvamAI(): SarvamAIService {
  if (!sarvamAIInstance) {
    throw new Error('Sarvam AI service not initialized. Call initializeSarvamAI() first.');
  }
  return sarvamAIInstance;
}
