# DevOverflow Client 📱

React frontend for DevOverflow with mobile support via Capacitor.

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Beautiful UI components
- **React Query** - Data fetching & caching
- **React Router** - Client-side routing
- **Clerk** - Authentication
- **Capacitor** - Native mobile apps
- **Vapi** - Voice AI integration

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### For Mobile Development

- **Android**: Android Studio
- **iOS**: Xcode (macOS only)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` file:

```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_API_URL="http://localhost:3001"
VITE_VAPI_PUBLIC_KEY="pk_..." # Optional for voice chat
```

### 3. Start Development Server

```bash
npm run dev
```

App will start at http://localhost:5173

## 📚 Available Scripts

```bash
npm run dev            # Development mode
npm run build          # Build for production
npm run build:dev      # Build in development mode
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

## 📱 Mobile Development

### Initial Setup

#### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

#### 2. Add Platforms

```bash
# Android
npx cap add android

# iOS (macOS only)
npx cap add ios
```

### Building for Mobile

#### 1. Build Web Assets

```bash
npm run build
```

#### 2. Sync with Native Projects

```bash
npx cap sync
```

Or use the combined command:

```bash
npm run build && npx cap sync
```

#### 3. Open in IDE

```bash
# Android Studio
npx cap open android

# Xcode (macOS only)
npx cap open ios
```

### Android Development

#### Prerequisites

1. Install [Android Studio](https://developer.android.com/studio)
2. Install Android SDK (API 33 or higher)
3. Set up Android emulator or connect physical device

#### Build APK

1. Open project in Android Studio:
   ```bash
   npx cap open android
   ```

2. In Android Studio:
   - Build > Build Bundle(s) / APK(s) > Build APK(s)
   - APK will be in `android/app/build/outputs/apk/`

#### Run on Device

```bash
# List devices
adb devices

# Run on connected device
npx cap run android
```

### iOS Development

#### Prerequisites (macOS only)

1. Install [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```

#### Build IPA

1. Open project in Xcode:
   ```bash
   npx cap open ios
   ```

2. In Xcode:
   - Select your development team
   - Product > Archive
   - Distribute App

#### Run on Simulator

```bash
npx cap run ios
```

### Capacitor Configuration

Edit `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devoverflow.app',
  appName: 'DevOverflow',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development, use your local IP
    // url: 'http://192.168.1.100:5173',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e293b',
      showSpinner: false,
    },
  },
};

export default config;
```

### Testing on Physical Device

#### Android

1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect via USB
4. Run:
   ```bash
   npx cap run android --target=<device-id>
   ```

#### iOS

1. Connect iPhone/iPad via USB
2. Trust computer on device
3. Select device in Xcode
4. Click Run button

### Live Reload for Mobile

For faster development, use live reload:

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://YOUR_LOCAL_IP:5173',
     cleartext: true
   }
   ```

3. Sync and run:
   ```bash
   npx cap sync
   npx cap run android  # or ios
   ```

## 🏗️ Project Structure

```
client/
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Root component
│   ├── pages/                  # Page components
│   │   ├── Home.tsx
│   │   ├── Questions.tsx
│   │   ├── QuestionDetail.tsx
│   │   ├── VoiceChat.tsx
│   │   └── routes.tsx
│   ├── components/             # Reusable components
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── QuestionCard.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── admin/                  # Admin panel
│   │   ├── pages/
│   │   ├── components/
│   │   └── AdminRoutes.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useQuestions.ts
│   │   ├── useUser.ts
│   │   └── use-mobile.ts
│   ├── api/                    # API client
│   │   ├── client.ts
│   │   └── types.ts
│   ├── lib/                    # Utilities
│   │   └── utils.ts
│   └── index.css               # Global styles
├── android/                    # Android project
├── ios/                        # iOS project
├── public/                     # Static assets
├── capacitor.config.ts         # Capacitor configuration
├── vite.config.ts              # Vite configuration
└── tailwind.config.js          # Tailwind configuration
```

## 🎨 Theming

### Dark Mode

The app supports dark mode using `next-themes`:

```typescript
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

### Customizing Theme

Edit `src/index.css` to customize colors:

```css
:root {
  --primary: 24 94% 58%;        /* Orange */
  --secondary: 215 25% 27%;     /* Slate */
  --accent: 158 64% 52%;        /* Emerald */
  /* ... */
}
```

## 🔐 Authentication

### Clerk Setup

1. Sign up at [clerk.com](https://clerk.com)
2. Create application
3. Copy publishable key to `.env.local`
4. Wrap app with `ClerkProvider`:

```typescript
import { ClerkProvider } from '@clerk/clerk-react';

<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>
```

## 🎤 Voice Chat

### Vapi Setup

1. Sign up at [vapi.ai](https://vapi.ai)
2. Get public key
3. Add to `.env.local`:
   ```env
   VITE_VAPI_PUBLIC_KEY="pk_..."
   ```

### Usage

```typescript
import Vapi from '@vapi-ai/web';

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

// Start call
await vapi.start({
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
  },
  model: {
    provider: 'openai',
    model: 'gpt-4',
  },
  voice: {
    provider: '11labs',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
  },
});

// End call
vapi.stop();
```

## 📊 State Management

### React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function Questions() {
  const { data, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => fetch('/api/questions').then(r => r.json()),
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* Render questions */}</div>;
}
```

## 🎯 Performance

### Code Splitting

Routes are automatically code-split by Vite.

### Image Optimization

Use `loading="lazy"` for images:

```tsx
<img src="/image.jpg" loading="lazy" alt="Description" />
```

### Bundle Analysis

```bash
npm run build -- --mode analyze
```

## 🐛 Troubleshooting

### Capacitor Issues

#### Clear Cache

```bash
npx cap sync --force
```

#### Rebuild Native Projects

```bash
# Android
cd android
./gradlew clean
cd ..

# iOS
cd ios/App
pod install
cd ../..
```

### Build Errors

#### Clear Node Modules

```bash
rm -rf node_modules package-lock.json
npm install
```

#### Clear Vite Cache

```bash
rm -rf node_modules/.vite
npm run dev
```

### Mobile Debugging

#### Android

```bash
# View logs
adb logcat

# Chrome DevTools
chrome://inspect
```

#### iOS

1. Open Safari
2. Develop > [Your Device] > [Your App]

## 🚀 Deployment

### Web Deployment

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Mobile Deployment

#### Android (Google Play)

1. Build signed APK/AAB in Android Studio
2. Create Google Play Console account
3. Upload to Play Console
4. Submit for review

#### iOS (App Store)

1. Archive in Xcode
2. Upload to App Store Connect
3. Submit for review

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk authentication key |
| `VITE_API_URL` | Yes | Backend API URL |
| `VITE_VAPI_PUBLIC_KEY` | No | Vapi voice AI key |

## 🔧 Configuration Files

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

### capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devoverflow.app',
  appName: 'DevOverflow',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
```

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@devoverflow.com
- Discord: https://discord.gg/devoverflow

---

Made with ❤️ by the DevOverflow Team
