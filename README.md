# Kinship App
### where every talent shines

A professional talent network for singers, dancers, chefs, photographers,
artists, fitness trainers — every creative with a skill worth discovering.

---

## All 38 files — complete list

```
KinshipApp/
├── package.json                          # 01 — dependencies
├── app.config.js                         # 02 — Expo config, splash, icons
├── babel.config.js                       # 03 — Babel with Reanimated plugin
├── tsconfig.json                         # 04 — TypeScript config
├── eas.json                              # 05 — EAS build profiles (APK + AAB)
├── .env.example                          # 06 — environment variables
│
├── src/
│   ├── constants/
│   │   └── theme.ts                      # 07 — colors, radius, shadows, talent palettes
│   ├── lib/
│   │   ├── api.ts                        # 08 — Axios client with auth interceptors
│   │   └── socket.ts                     # 09 — Socket.IO client (separate file)
│   ├── store/
│   │   └── auth.store.ts                 # 10 — Zustand auth state + SecureStore
│   ├── components/
│   │   ├── Avatar.tsx                    # 11 — user avatar with talent colour fallback
│   │   ├── TalentBadge.tsx               # 12 — coloured skill badge
│   │   ├── VerifyTick.tsx                # 13 — purple verified checkmark
│   │   ├── PostCard.tsx                  # 14 — feed post card with like/comment
│   │   ├── TalentCard.tsx                # 15 — discover talent card
│   │   ├── OpportunityCard.tsx           # 16 — gig board card with apply button
│   │   ├── SuggestRow.tsx                # 17 — horizontal "people to connect" row
│   │   └── index.ts                      # 18 — barrel export for all components
│   └── screens/
│       ├── OnboardingScreen.tsx          # 19 — 3-step animated onboarding
│       ├── FeedScreen.tsx                # 20 — Feed + Explore + Gigs + Collabs
│       └── ProfileScreen.tsx             # 21 — Profile + Chat + Login
│
├── app/
│   ├── _layout.tsx                       # 22 — root layout (QueryClient, Socket, Splash)
│   ├── index.tsx                         # 23 — auth gate → feed or onboarding
│   ├── notifications.tsx                 # 34 — notifications list
│   ├── (auth)/
│   │   ├── _layout.tsx                   # 24 — auth stack layout
│   │   ├── onboarding.tsx                # 25 — onboarding route
│   │   └── login.tsx                     # 26 — login route
│   ├── (tabs)/
│   │   ├── _layout.tsx                   # 27 — bottom tab navigator
│   │   ├── feed.tsx                      # 28 — home feed tab
│   │   ├── explore.tsx                   # 29 — talent discovery tab
│   │   ├── create.tsx                    # 30 — create post tab
│   │   ├── gigs.tsx                      # 31a — gig board tab
│   │   ├── collabs.tsx                   # 31b — collaborations tab
│   │   ├── messages.tsx                  # 32 — conversations tab
│   │   └── profile.tsx                   # 31c — own profile tab
│   ├── profile/
│   │   └── [id].tsx                      # 33a — any user's profile page
│   ├── chat/
│   │   └── [userId].tsx                  # 33b — real-time chat page
│   ├── post/
│   │   └── [id].tsx                      # 33c — post detail + comments
│   └── booking/
│       └── [talentId].tsx                # 35 — book a talent (modal)
│
└── assets/
    ├── splash.svg                        # 36 — splash screen (dark, expressive)
    └── icon.svg                          # 37 — app icon (violet gradient + K)
```

---

## Get it on your phone — 3 ways

### Fastest: Expo Go (5 min, no accounts needed)

```bash
# 1. Install Node.js from https://nodejs.org (LTS)
# 2. Open terminal in the KinshipApp folder

npm install
npx expo start

# 3. Download "Expo Go" from Play Store on Android
# 4. Scan the QR code shown in terminal
# → Kinship runs on your phone instantly
```

### Real APK (installable .apk — no Play Store needed)

```bash
# 1. Create free account at https://expo.dev
# 2. Install EAS CLI

npm install -g eas-cli
eas login

# 3. Inside KinshipApp folder:
npm install
eas build --platform android --profile preview

# 4. EAS builds in cloud → gives you a download link
# 5. Download .apk → send to phone → install
#    (Settings → Security → Install from unknown sources)
```

### Android Studio (local build on your machine)

```bash
# Install Android Studio from https://developer.android.com/studio
npx expo run:android
# Compiles and installs directly on connected device or emulator
```

---

## Connect to your backend

Edit `src/lib/api.ts` line 4 to point to your backend:

```typescript
// Android emulator → 10.0.2.2 = your laptop's localhost
const BASE = "http://10.0.2.2:3000/api/v1";

// Physical device on same WiFi → your laptop's IP
const BASE = "http://192.168.1.100:3000/api/v1";

// Production
const BASE = "https://api.kinship.app/api/v1";
```

Or create a `.env` file:
```
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api/v1
```

---

## What's inside every screen

| Screen | What it does |
|--------|-------------|
| Onboarding | Animated 3-step: welcome → pick talent categories → build profile |
| Login | Dark signin with password toggle |
| Feed | Infinite scroll posts with likes, comments, suggest row |
| Explore | Talent search — filter by skill, city, category |
| Create | Post with photo/video picker + talent category tagging |
| Gigs | Opportunity board — filter by skill, one-tap apply |
| Collabs | AI-matched collaborators with % match score |
| Messages | Conversation list with unread dots |
| Chat | Real-time messaging with gradient bubbles (Socket.IO) |
| Profile | Stats, skills, portfolio grid, book button |
| Post detail | Full post with comments |
| Notifications | Type-specific icons, unread highlight, mark all read |
| Booking | Book a talent for events — full form with Razorpay |

---

## What you need to set up yourself

These require real accounts (Claude cannot create them for you):

| What | Why you need it | Where to get it |
|------|----------------|----------------|
| Backend server | The API the app talks to | See `kinship-prod/` folder |
| Expo account (free) | To build the APK | expo.dev |
| Firebase (optional) | Push notifications | console.firebase.google.com |
| Razorpay (optional) | Accept payments | razorpay.com |

The app runs fine without Firebase or Razorpay — those features just won't work until configured on the backend.

---

## Design

- **Background:** near-black `#0D0D0F`
- **Primary:** deep violet `#7C5CFC`
- **Accent:** warm coral `#FF6B52`
- **Each talent** has its own dark badge colour — singers are violet, dancers pink, chefs orange, artists green
- Bottom tab has glowing active indicator
- Gradient buttons throughout for energy
- Blur tab bar on iOS

---

Built for every talent the world deserves to discover.
