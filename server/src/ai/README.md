# AI Module - Simplified

This module provides a simple Gemini-powered chatbot API.

## Setup

1. Get your free Gemini API key from: https://makersuite.google.com/app/apikey

2. Add it to `.env`:
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

3. The Gemini package is already installed via `npm install @google/generative-ai`

## API Endpoint

### POST `/ai/chat`

Ask any coding question and get an AI-generated answer.

**Request Body:**
```json
{
  "question": "How to fix undefined error in React?"
}
```

**Response:**
```json
{
  "answer": "Detailed markdown-formatted answer...",
  "model": "gemini-1.5-flash",
  "tokensUsed": 0
}
```

## Client Usage

The chatbot component (`client/src/components/AIChatbot.tsx`) uses this API:

```typescript
import { aiService } from "@/api/services/ai.service";

const response = await aiService.chat("Your question here");
console.log(response.answer);
```

## Features

- Direct Gemini API integration (FREE!)
- Markdown-formatted responses
- No quota limits on free tier
- Fallback responses if API fails
- Clean, simple architecture

## Why Gemini?

- **Free**: Generous free tier with no credit card required
- **Fast**: Quick response times
- **Capable**: Comparable to GPT-3.5 in most tasks
- **Easy**: Simple API with great documentation
