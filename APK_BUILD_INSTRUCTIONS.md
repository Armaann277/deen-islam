# Building Deen Islam APK

## Prerequisites
1. Install [Android Studio](https://developer.android.com/studio)
2. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

## Build Steps

### 1. Build the web app
```bash
npm run build
```

### 2. Sync with Capacitor
```bash
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build APK
In Android Studio:
1. Wait for Gradle sync to complete
2. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for the build to finish
4. Click **locate** in the notification to find your APK

### 5. APK Location
The APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### For Release APK
1. Go to **Build** → **Generate Signed Bundle / APK**
2. Choose **APK**
3. Create or select a keystore
4. Choose **release** build variant
5. The release APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Quick Commands
```bash
# Full build pipeline
npm run build && npx cap sync android && npx cap open android
```

## App Details
- **App Name:** Deen Islam
- **Package:** com.deen.islam
- **Min SDK:** 22 (Android 5.1)
- **Target SDK:** 34 (Android 14)
