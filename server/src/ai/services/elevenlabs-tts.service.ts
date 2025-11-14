import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ElevenLabsTtsService {
  private readonly logger = new Logger(ElevenLabsTtsService.name);
  private readonly apiKey: string;
  private readonly voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Bella - natural female voice

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
  }

  /**
   * Convert text to speech using ElevenLabs API
   * Returns base64 encoded audio data
   */
  async textToSpeech(text: string): Promise<string> {
    try {
      // Clean the text
      const cleanText = this.cleanTextForSpeech(text);
      const truncatedText = cleanText.substring(0, 5000);

      this.logger.log(`Generating speech for ${truncatedText.length} characters`);

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
        {
          text: truncatedText,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      // Convert to base64
      const base64Audio = Buffer.from(response.data, 'binary').toString('base64');
      
      this.logger.log('Speech generated successfully');
      return base64Audio;
    } catch (error) {
      this.logger.error('Error generating speech:', error.response?.data || error.message);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * Clean text for better speech synthesis
   */
  private cleanTextForSpeech(text: string): string {
    let cleaned = text;

    // Remove code blocks
    cleaned = cleaned.replace(/```[\s\S]*?```/g, ' code example. ');
    
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
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Natural male voice', gender: 'male' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Natural female voice', gender: 'female' },
      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm female voice', gender: 'female' },
      { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong female voice', gender: 'female' },
      { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded male voice', gender: 'male' },
    ];
  }
}
