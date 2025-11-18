# Vapi API Keys Setup Guide

## Quick Answer

**You only need the PUBLIC KEY for voice chat to work!**

## Where to Put Keys

### ✅ Required: Public Key (Client-Side)

**File:** `client/.env.local`

```env
VITE_VAPI_PUBLIC_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxx
```

This is the **ONLY** key you need to make voice chat work!

### ❌ Optional: Private Key (Server-Side)

**File:** `server/.env` (commented out by default)

```env
# VAPI_PRIVATE_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx
```

Only uncomment and add this if you want to:
- Create Vapi assistants programmatically from backend
- Manage Vapi resources via API
- Use Vapi webhooks with authentication

**For basic voice chat, you DON'T need this!**

## How to Get Your Keys

1. **Go to Vapi Dashboard**
   - Visit: https://vapi.ai
   - Sign up or log in

2. **Navigate to API Keys**
   - Click on your profile/settings
   - Go to "API Keys" section

3. **Copy Your Public Key**
   - Look for the key starting with `pk_`
   - Click "Copy" button
   - Paste it in `client/.env.local`

4. **Save and Restart**
   - Save the `.env.local` file
   - Restart your React dev server:
     ```bash
     cd client
     npm run dev
     ```

## Testing

1. Navigate to: `http://localhost:5173/voice-chat`
2. Click "Start Voice Chat"
3. Allow microphone access
4. Start speaking!

## Troubleshooting

**Error: "Invalid API key"**
- Check that you copied the PUBLIC key (starts with `pk_`)
- Make sure there are no extra spaces
- Verify the key is in `client/.env.local` not `server/.env`

**Error: "Microphone not accessible"**
- Allow microphone permissions in browser
- Use HTTPS in production (required for microphone)
- Try a different browser

**No response from AI**
- Check your Vapi dashboard for usage/credits
- Verify your account is active
- Check browser console for errors

## Key Differences

| Key Type | Starts With | Location | Purpose |
|----------|-------------|----------|---------|
| Public Key | `pk_` | `client/.env.local` | Initialize Vapi in browser |
| Private Key | `sk_` | `server/.env` | Server-side API calls |

## Security Notes

- ✅ Public keys are safe to use in client-side code
- ✅ They're designed to be exposed in browser
- ❌ Never expose private keys in client code
- ❌ Never commit private keys to git

## Example Configuration

**client/.env.local:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_dW5jb21tb24tamF5YmlyZC02LmNsZXJrLmFjY291bnRzLmRldiQ
VITE_API_URL=http://localhost:3001
VITE_VAPI_PUBLIC_KEY=pk_abc123xyz789
```

That's it! Just add your public key and you're ready to go! 🎤
