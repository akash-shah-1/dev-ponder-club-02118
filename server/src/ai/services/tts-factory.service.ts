import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElevenLabsTtsService } from './elevenlabs-tts.service';

export interface ITtsService {
  textToSpeech(text: string): Promise<string>;
  getAvailableVoices(): any[];
}

@Injectable()
export class TtsFactoryService {
  private currentService: ITtsService;

  constructor(
    private configService: ConfigService,
    private elevenLabsTtsService: ElevenLabsTtsService,
  ) {
    // Default to ElevenLabs, can be switched via env variable
    const ttsProvider = this.configService.get<string>('TTS_PROVIDER') || 'elevenlabs';
    this.setProvider(ttsProvider);
  }

  setProvider(provider: string) {
    switch (provider.toLowerCase()) {
      case 'elevenlabs':
        this.currentService = this.elevenLabsTtsService;
        break;
      // Add more providers here in future
      default:
        this.currentService = this.elevenLabsTtsService;
    }
  }

  async textToSpeech(text: string): Promise<string> {
    return this.currentService.textToSpeech(text);
  }

  getAvailableVoices() {
    return this.currentService.getAvailableVoices();
  }
}
