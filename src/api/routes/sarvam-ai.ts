import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getSarvamAI } from '../services/sarvam-ai';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/sarvam-ai/transcribe
 * Transcribe audio file to text
 */
router.post(
  '/transcribe',
  upload.single('audio'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided',
        });
      }

      const language = (req.body.language || 'en') as string;
      const sarvamAI = getSarvamAI();
      const result = await sarvamAI.transcribeAudio(req.file.buffer, language);

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Transcription error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
);

/**
 * POST /api/sarvam-ai/transcribe-url
 * Transcribe audio from URL
 */
router.post('/transcribe-url', async (req: Request, res: Response) => {
  try {
    const { audioUrl, language = 'en' } = req.body;

    if (!audioUrl) {
      return res.status(400).json({
        success: false,
        error: 'Audio URL is required',
      });
    }

    const sarvamAI = getSarvamAI();
    const result = await sarvamAI.transcribeFromUrl(audioUrl, language);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * GET /api/sarvam-ai/languages
 * Get supported languages
 */
router.get('/languages', (_req: Request, res: Response) => {
  try {
    const sarvamAI = getSarvamAI();
    const languages = sarvamAI.getSupportedLanguages();
    return res.json({
      success: true,
      languages,
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;
