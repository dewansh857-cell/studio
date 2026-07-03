# Sarvam AI Integration Guide

This document describes the Sarvam AI voice-to-text integration in the Studio API.

## Overview

Sarvam AI provides state-of-the-art speech-to-text (voice-to-text) capabilities supporting multiple Indian languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, Bengali, Urdu, and Punjabi, along with English.

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SARVAM_AI_API_KEY=sk_svjzjv7o_vwHiEucHZQDjSyANyLa1yFBD
SARVAM_AI_API_URL=https://api.sarvam.ai/speech-to-text
SARVAM_AI_TIMEOUT=30000
SARVAM_AI_RETRY_ATTEMPTS=3
SARVAM_AI_RETRY_DELAY=1000
```

**⚠️ Security Warning:** Never commit your `.env` file to version control. Always use environment variables or GitHub Secrets for sensitive data.

### 2. Installation

Install required dependencies:

```bash
npm install axios multer
npm install -D @types/multer
```

### 3. Initialize Service

In your main application file (e.g., `src/app.ts` or `src/index.ts`):

```typescript
import { initializeSarvamAI } from './services/sarvam-ai';
import sarvamAIRouter from './api/routes/sarvam-ai';

// Initialize Sarvam AI service
initializeSarvamAI();

// Register routes
app.use('/api/sarvam-ai', sarvamAIRouter);
```

## API Endpoints

### 1. Transcribe Audio File

**POST** `/api/sarvam-ai/transcribe`

Transcribe an uploaded audio file to text.

**Request:**
```bash
curl -X POST http://localhost:3000/api/sarvam-ai/transcribe \
  -F "audio=@path/to/audio.wav" \
  -F "language=en"
```

**Parameters:**
- `audio` (required): Audio file (multipart/form-data)
- `language` (optional): Language code (default: 'en')
  - Supported: `en`, `hi`, `ta`, `te`, `kn`, `ml`, `gu`, `mr`, `bn`, `ur`, `pa`

**Response:**
```json
{
  "success": true,
  "transcription": "Hello, how are you?"
}
```

### 2. Transcribe from URL

**POST** `/api/sarvam-ai/transcribe-url`

Transcribe audio from a direct URL.

**Request:**
```bash
curl -X POST http://localhost:3000/api/sarvam-ai/transcribe-url \
  -H "Content-Type: application/json" \
  -d '{
    "audioUrl": "https://example.com/audio.wav",
    "language": "en"
  }'
```

**Parameters:**
- `audioUrl` (required): URL to the audio file
- `language` (optional): Language code (default: 'en')

**Response:**
```json
{
  "success": true,
  "transcription": "Hello, how are you?"
}
```

### 3. Get Supported Languages

**GET** `/api/sarvam-ai/languages`

Get the list of supported languages.

**Request:**
```bash
curl http://localhost:3000/api/sarvam-ai/languages
```

**Response:**
```json
{
  "success": true,
  "languages": ["en", "hi", "ta", "te", "kn", "ml", "gu", "mr", "bn", "ur", "pa"]
}
```

## Usage Examples

### TypeScript/Node.js

```typescript
import { initializeSarvamAI, getSarvamAI } from './services/sarvam-ai';
import fs from 'fs';

// Initialize service
initializeSarvamAI();

// Get service instance
const sarvamAI = getSarvamAI();

// Transcribe audio file
const audioBuffer = fs.readFileSync('path/to/audio.wav');
const result = await sarvamAI.transcribeAudio(audioBuffer, 'en');

if (result.success) {
  console.log('Transcription:', result.transcription);
} else {
  console.error('Error:', result.error);
}

// Transcribe from URL
const urlResult = await sarvamAI.transcribeFromUrl(
  'https://example.com/audio.wav',
  'hi'
);
```

### Python (Using curl/HTTP)

```python
import requests

# Transcribe audio file
with open('audio.wav', 'rb') as f:
    files = {'audio': f}
    data = {'language': 'en'}
    response = requests.post(
        'http://localhost:3000/api/sarvam-ai/transcribe',
        files=files,
        data=data
    )
    print(response.json())
```

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| hi | Hindi | हिन्दी |
| ta | Tamil | தமிழ் |
| te | Telugu | తెలుగు |
| kn | Kannada | ಕನ್ನಡ |
| ml | Malayalam | മലയാളം |
| gu | Gujarati | ગુજરાતી |
| mr | Marathi | मराठी |
| bn | Bengali | বাংলা |
| ur | Urdu | اردو |
| pa | Punjabi | ਪੰਜਾਬੀ |

## Error Handling

Common error responses:

```json
{
  "success": false,
  "error": "No audio file provided",
  "statusCode": 400
}
```

```json
{
  "success": false,
  "error": "Sarvam AI API key is required",
  "statusCode": 500
}
```

## Best Practices

1. **Security:**
   - Never commit API keys to version control
   - Use GitHub Secrets for CI/CD pipelines
   - Rotate API keys regularly

2. **Performance:**
   - Implement caching for repeated transcriptions
   - Use URL-based transcription for remote files
   - Set appropriate timeouts based on audio file size

3. **Error Handling:**
   - Always check the `success` flag in responses
   - Implement retry logic for failed requests
   - Log errors for debugging

4. **Audio Format:**
   - Supported formats: WAV, MP3, OGG, FLAC
   - Recommended: WAV format for best quality
   - Maximum file size: 25MB

## Troubleshooting

### API Key Error
```
Error: SARVAM_AI_API_KEY environment variable is not set
```
**Solution:** Ensure `.env` file exists and contains the API key.

### Connection Timeout
```
Error: Request timeout
```
**Solution:** Increase `SARVAM_AI_TIMEOUT` in environment variables or check API status at https://status.sarvam.ai

### Invalid Language Code
```
Error: Unsupported language
```
**Solution:** Use only supported language codes. Call `/api/sarvam-ai/languages` endpoint to verify.

## References

- [Sarvam AI API Documentation](https://docs.sarvam.ai/)
- [Supported Languages](https://docs.sarvam.ai/languages)
- [API Endpoints](https://docs.sarvam.ai/api-endpoints)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Sarvam AI documentation
3. Contact Sarvam AI support at support@sarvam.ai
