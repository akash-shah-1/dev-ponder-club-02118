import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
  }

  /**
   * Convert text to speech using Google Cloud Text-to-Speech API
   * Returns base64 encoded audio data
   */
  async textToSpeech(text: string): Promise<string> {
    try {
      // Clean the text - remove markdown formatting for better speech
      const cleanText = this.cleanTextForSpeech(text);

      // Limit text length (Google TTS has a 5000 character limit)
      const truncatedText = cleanText.substring(0, 4500);

      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
        {
          input: { text: truncatedText },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-J',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0.0,
            volumeGainDb: 0.0,
            effectsProfileId: ['headphone-class-device'],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Return base64 encoded audio
      return response.data.audioContent;
    } catch (error) {
      this.logger.error('Error generating speech:', error.response?.data || error.message);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * Clean text for better speech synthesis
   * Removes markdown, code blocks, and special characters
   */
  private cleanTextForSpeech(text: string): string {
    let cleaned = text;

    // Remove code blocks
    cleaned = cleaned.replace(/```[\s\S]*?```/g, ' [code example] ');
    
    // Remove inline code
    cleaned = cleaned.replace(/`[^`]+`/g, ' ');
    
    // Remove markdown headers
    cleaned = cleaned.replace(/#{1,6}\s+/g, '');
    
    // Remove markdown bold/italic
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
    cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
    cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
    
    // Remove markdown links
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Remove bullet points
    cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
    
    // Remove numbered lists
    cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');
    
    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    return [
      { name: 'en-US-Neural2-J', description: 'Natural male voice (clear)', gender: 'male' },
      { name: 'en-US-Neural2-D', description: 'Natural male voice (deeper)', gender: 'male' },
      { name: 'en-US-Neural2-F', description: 'Natural female voice', gender: 'female' },
      { name: 'en-US-Neural2-A', description: 'Natural female voice (warmer)', gender: 'female' },
      { name: 'en-US-Neural2-C', description: 'Natural female voice (younger)', gender: 'female' },
    ];
  }
}
