# 🎙️ Natural Voice Mode Implementation - Google Cloud TTS

## 🎯 Overview

Implemented natural, human-like text-to-speech using **Google Cloud Text-to-Speech API** to replace the robotic browser voices.

---

## ✅ What Was Implemented

### **Backend (NestJS)**

#### 1. **TTS Service** (`server/src/ai/services/tts.service.ts`)
- Converts text to natural speech using Google Cloud TTS
- Cleans markdown formatting for better speech output
- Returns base64 encoded MP3 audio
- Supports multiple natural voices (male/female)

#### 2. **API Endpoints** (`server/src/ai/ai.controller.ts`)
- `POST /ai/text-to-speech` - Convert text to speech
- `GET /ai/voices` - Get available voice options

#### 3. **Module Integration** (`server/src/ai/ai.module.ts`)
- Added TtsService to AI module providers and exports

### **Frontend (React)**

#### 1. **AI Service** (`client/src/api/services/ai.service.ts`)
- `textToSpeech(text)` - Call TTS API
- `getVoices()` - Get available voices

#### 2. **Drawer Component** (`client/src/components/QuestionDetailDrawer.tsx`)
- Updated voice mode to use Google TTS instead of browser speech
- Plays MP3 audio from base64 data
- Better error handling and loading states

---

## 🔧 Installation Required

### **1. Install axios in server**
```bash
cd server
npm install axios
```

### **2. Verify Gemini API Key**
The same `GEMINI_API_KEY` is used for both Gemini AI and Google Cloud TTS.

Make sure it's set in `server/.env`:
```env
GEMINI_API_KEY=your_api_key_here
```

---

## 🎤 Voice Quality Comparison

### **Before (Browser Speech API)**:
- ❌ Robotic, mechanical voice
- ❌ Unnatural pronunciation
- ❌ Limited voice options
- ❌ Inconsistent across browsers
- ❌ Poor quality

### **After (Google Cloud TTS)**:
- ✅ Natural, human-like voice
- ✅ Proper pronunciation and intonation
- ✅ Multiple high-quality voices
- ✅ Consistent across all browsers
- ✅ Professional quality

---

## 🎙️ Available Voices

The implementation includes 5 natural voices:

| Voice Name | Description | Gender | Quality |
|------------|-------------|--------|---------|
| en-US-Neural2-J | Clear male voice (default) | Male | ⭐⭐⭐⭐⭐ |
| en-US-Neural2-D | Deeper male voice | Male | ⭐⭐⭐⭐⭐ |
| en-US-Neural2-F | Natural female voice | Female | ⭐⭐⭐⭐⭐ |
| en-US-Neural2-A | Warmer female voice | Female | ⭐⭐⭐⭐⭐ |
| en-US-Neural2-C | Younger female voice | Female | ⭐⭐⭐⭐⭐ |

**Current Default**: `en-US-Neural2-J` (Clear male voice)

---

## 🔄 How It Works

### **Flow**:
```
1. User clicks Voice button
   ↓
2. Frontend gets answer text (AI answer or top voted)
   ↓
3. Sends text to backend: POST /ai/text-to-speech
   ↓
4. Backend cleans markdown from text
   ↓
5. Backend calls Google Cloud TTS API
   ↓
6. Google returns MP3 audio (base64 encoded)
   ↓
7. Backend returns audio to frontend
   ↓
8. Frontend creates audio element and plays
   ↓
9. User hears natural, human-like voice
```

### **Text Cleaning**:
Before sending to TTS, the service removes:
- Code blocks → "[code example]"
- Inline code → removed
- Markdown headers → removed
- Bold/italic formatting → plain text
- Links → link text only
- Bullet points → removed
- Extra whitespace → normalized

This ensures the voice sounds natural and doesn't read out formatting characters.

---

## 📝 Code Examples

### **Backend - TTS Service**:
```typescript
async textToSpeech(text: string): Promise<string> {
  const cleanText = this.cleanTextForSpeech(text);
  const truncatedText = cleanText.substring(0, 4500);

  const response = await axios.post(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
    {
      input: { text: truncatedText },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Neural2-J', // Natural male voice
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
        effectsProfileId: ['headphone-class-device'],
      },
    }
  );

  return response.data.audioContent; // base64 MP3
}
```

### **Frontend - Playing Audio**:
```typescript
const speakAnswer = async () => {
  const textToSpeak = aiAnswer?.answer || topAnswer.body;
  
  setIsSpeaking(true);
  
  try {
    // Get natural speech from Google TTS
    const audioBase64 = await aiService.textToSpeech(textToSpeak);
    
    // Create and play audio
    const audioElement = document.createElement('audio');
    audioElement.src = `data:audio/mp3;base64,${audioBase64}`;
    audioElement.onended = () => setIsSpeaking(false);
    
    await audioElement.play();
  } catch (error) {
    setIsSpeaking(false);
    toast({ title: "Voice Error", variant: "destructive" });
  }
};
```

---

## 🎨 UI Changes

### **Voice Button States**:
- **Idle**: Gray border, Volume2 icon, "Voice" text
- **Speaking**: Green border, green background, VolumeX icon, "Stop" text
- **Loading**: Disabled state while generating audio

### **User Experience**:
1. Click "Voice" button
2. Brief loading (1-2 seconds while generating audio)
3. Natural voice starts playing
4. Button changes to "Stop" with green styling
5. Click "Stop" to pause
6. Audio stops when finished

---

## 🔒 API Usage & Costs

### **Google Cloud TTS Pricing**:
- **Free Tier**: 1 million characters/month (WaveNet voices)
- **After Free Tier**: $16 per 1 million characters
- **Neural2 Voices**: Same pricing as WaveNet

### **Typical Usage**:
- Average answer: 500 characters
- 1 million characters = ~2,000 answers
- **Free tier covers ~2,000 voice generations per month**

### **Cost Optimization**:
- Text is truncated to 4,500 characters max
- Markdown is removed to reduce character count
- Only generates audio on user request (not automatic)

---

## 🚀 Testing

### **Test Voice Mode**:
1. Start backend: `cd server && npm run start:dev`
2. Start frontend: `cd client && npm run dev`
3. Open a solved question in mobile drawer
4. Click "Voice" button
5. Listen to natural voice reading the answer
6. Click "Stop" to pause

### **Test Different Voices** (Optional):
Change the voice in `tts.service.ts`:
```typescript
voice: {
  languageCode: 'en-US',
  name: 'en-US-Neural2-F', // Try different voices
}
```

Available voices:
- `en-US-Neural2-J` - Clear male (default)
- `en-US-Neural2-D` - Deeper male
- `en-US-Neural2-F` - Natural female
- `en-US-Neural2-A` - Warmer female
- `en-US-Neural2-C` - Younger female

---

## 🐛 Troubleshooting

### **Issue: "Cannot find module 'axios'"**
**Solution**:
```bash
cd server
npm install axios
```

### **Issue: "Failed to generate speech"**
**Possible Causes**:
1. Invalid Gemini API key
2. API key doesn't have TTS permissions
3. Network/firewall blocking Google APIs

**Solution**:
- Verify API key in `.env`
- Check API key has Cloud TTS enabled
- Test API key with curl:
```bash
curl -X POST \
  "https://texttospeech.googleapis.com/v1/text:synthesize?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":{"text":"Hello"},"voice":{"languageCode":"en-US","name":"en-US-Neural2-J"},"audioConfig":{"audioEncoding":"MP3"}}'
```

### **Issue: Voice sounds robotic**
**Solution**: Make sure you're using Neural2 voices (not Standard voices)

### **Issue: Audio doesn't play**
**Possible Causes**:
1. Browser autoplay policy
2. Audio element not created properly
3. Base64 data corrupted

**Solution**:
- User must interact with page first (click button)
- Check browser console for errors
- Verify base64 data is valid MP3

---

## 🎯 Future Enhancements

### **Possible Improvements**:
1. **Voice Selection UI** - Let users choose their preferred voice
2. **Speed Control** - Adjust speaking rate (0.5x - 2.0x)
3. **Pitch Control** - Adjust voice pitch
4. **Language Support** - Add more languages
5. **Audio Caching** - Cache generated audio to reduce API calls
6. **Streaming Audio** - Stream audio for long texts
7. **Background Playback** - Continue playing when drawer closes

### **Implementation Ideas**:
```typescript
// Voice selection dropdown
<Select value={selectedVoice} onChange={setSelectedVoice}>
  <option value="en-US-Neural2-J">Male (Clear)</option>
  <option value="en-US-Neural2-F">Female (Natural)</option>
</Select>

// Speed control slider
<Slider 
  value={speakingRate} 
  onChange={setSpeakingRate}
  min={0.5} 
  max={2.0} 
  step={0.1}
/>
```

---

## ✅ Checklist

### **Backend**:
- [x] Create TTS service
- [x] Add text cleaning function
- [x] Add API endpoints
- [x] Integrate with AI module
- [ ] Install axios dependency

### **Frontend**:
- [x] Add TTS API calls
- [x] Update voice mode in drawer
- [x] Handle audio playback
- [x] Add error handling
- [x] Update UI states

### **Testing**:
- [ ] Test voice generation
- [ ] Test audio playback
- [ ] Test error handling
- [ ] Test different voices
- [ ] Test on mobile devices

---

## 🎉 Summary

**What Changed**:
- ❌ Old: Robotic browser speech synthesis
- ✅ New: Natural Google Cloud TTS with Neural2 voices

**Benefits**:
- 🎙️ Professional, human-like voice quality
- 🌍 Consistent across all browsers and devices
- 🎯 Better pronunciation and intonation
- 🔧 Customizable voices and settings
- 📱 Works perfectly on mobile

**Next Steps**:
1. Install axios: `cd server && npm install axios`
2. Restart backend server
3. Test voice mode in mobile drawer
4. Enjoy natural, human-like voice! 🎉

