# StayBee Android (Capacitor)

The Android app wraps the existing React web app and talks to the live Vercel API.

## Prerequisites

- Node.js 24.x (22+ works locally)
- [Android Studio](https://developer.android.com/studio) with Android SDK
- **Java JDK 17** (set `JAVA_HOME`, e.g. `C:\Program Files\OpenLogic\jdk-17.0.12.7-hotspot`)

## Build a debug APK (testing)

```bash
npm install
npm run build:android
npm run android:debug
```

APK output:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Open in Android Studio

```bash
npm run cap:open
```

Then use **Build > Build Bundle(s) / APK(s)** for signed release builds.

## Play Store release (AAB)

1. Create a keystore:
   ```bash
   keytool -genkey -v -keystore staybee-release.keystore -alias staybee -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add signing config in `android/app/build.gradle` (see [Capacitor Android docs](https://capacitorjs.com/docs/android)).
3. Build:
   ```bash
   npm run build:android
   cd android && gradlew.bat bundleRelease
   ```
4. Upload `android/app/build/outputs/bundle/release/app-release.aab` to Google Play Console.

## API / environment

Mobile builds use `.env.production`:

```
VITE_API_BASE_URL=https://stay-bee-alpha.vercel.app
```

Deploy API CORS changes to Vercel before testing auth on device.

## App ID

- Package: `com.staybee.app`
- Name: `StayBee`

Change these in `capacitor.config.ts` before publishing if needed.
