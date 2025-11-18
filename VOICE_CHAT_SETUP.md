# Voice AI Chat Setup Guide

## Overview
Voice AI Chat allows students to have voice conversations with AI about coding questions using Vapi.

## Setup Instructions

### 1. Get Vapi API Key
1. Go to [Vapi Dashboard](https://vapi.ai)
2. Sign up or log in
3. Navigate to API Keys section
4. Copy your Public Key

### 2. Configure Environment Variables

Add to `client/.env.local`:
```
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

### 3. Install Dependencies (Already Done)
```bash
cd client
npm install @vapi-ai/web
```

### 4. Features
- Real-time voice conversation with AI
- Visual feedback (speaking/listening states)
- Conversation history display
- Microphone permission handling
- Error handling and retry logic

### 5. Usage
1. Navigate to `/voice-chat` in the app
2. Click "Start Voice Chat" button
3. Allow microphone access when prompted
4. Start speaking your coding questions
5. AI will respond with voice and text

### 6. Customization Options

In `client/src/pages/VoiceChat.tsx`, you can customize:

**Transcriber Settings:**
- Provider: deepgram, assembly
- Model: nova-2, base
- Language: en-US, es-ES, etc.

**AI Model:**
- Provider: openai, anthropic
- Model: gpt-4, gpt-3.5-turbo, claude-3
- System prompt for behavior

**Voice Settings:**
- Provider: 11labs, playht, azure
- Voice ID for different voices
- Speed, pitch adjustments

### 7. Troubleshooting

**Microphone not working:**
- Check browser permissions
- Ensure HTTPS (required for microphone access)
- Try different browser

**Connection errors:**
- Verify API key is correct
- Check network connection
- Review browser console for errors

**Poor audio quality:**
- Use headphones to avoid echo
- Ensure stable internet connection
- Speak clearly at normal pace

### 8. Integration with Existing AI Service

The voice chat uses Vapi's built-in AI models. To integrate with your existing `AiService`:

1. Create a backend endpoint in `server/src/ai/ai.controller.ts`
2. Use Vapi's webhook feature to send transcripts to your backend
3. Process with your AI service and return responses
4. Configure custom function calling in Vapi

### 9. Cost Considerations

Vapi pricing is based on:
- Minutes of conversation
- AI model used (GPT-4 is more expensive)
- Voice provider (11labs is premium)

Consider using:
- GPT-3.5-turbo for cost savings
- Deepgram for transcription (included)
- Set conversation time limits

### 10. Security

- API keys are public keys (safe for client-side)
- Implement rate limiting on backend
- Monitor usage in Vapi dashboard
- Set up usage alerts

## Next Steps

1. Get your Vapi API key
2. Add it to `.env.local`
3. Test the voice chat feature
4. Customize voice and AI settings
5. Monitor usage and costs
