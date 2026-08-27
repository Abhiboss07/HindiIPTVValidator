#!/usr/bin/env bash
set -e

SDK_DIR="/home/abhiboss/Android/Sdk"
BUILD_TOOLS="$SDK_DIR/build-tools/35.0.0"
PLATFORM="$SDK_DIR/platforms/android-35/android.jar"

echo "🚀 Building AakashStream APK..."

rm -rf android_app/build
mkdir -p android_app/build/obj android_app/build/apk android_app/build/dex

echo "1️⃣ Compiling Resources (aapt2)..."
$BUILD_TOOLS/aapt2 compile --dir android_app/src/main/res -o android_app/build/res.zip

echo "2️⃣ Linking Resources and Generating R.java..."
$BUILD_TOOLS/aapt2 link -I $PLATFORM \
  --manifest android_app/src/main/AndroidManifest.xml \
  -o android_app/build/apk/app-unaligned.apk \
  -A android_app/src/main/assets \
  --java android_app/src/main/java \
  android_app/build/res.zip \
  --min-sdk-version 24 --target-sdk-version 34 --auto-add-overlay

echo "3️⃣ Compiling Java Code..."
javac --release 11 -cp $PLATFORM -d android_app/build/obj \
  android_app/src/main/java/com/aakashstream/app/*.java

echo "4️⃣ Converting to DEX (d8)..."
$BUILD_TOOLS/d8 --lib $PLATFORM --output android_app/build/dex android_app/build/obj/com/aakashstream/app/*.class

echo "5️⃣ Packaging DEX into APK with Python zipfile..."
python3 -c "
import zipfile
with zipfile.ZipFile('android_app/build/apk/app-unaligned.apk', 'a') as zf:
    zf.write('android_app/build/dex/classes.dex', 'classes.dex')
print('classes.dex added successfully!')
"

echo "6️⃣ Aligning APK (zipalign)..."
$BUILD_TOOLS/zipalign -p -f 4 android_app/build/apk/app-unaligned.apk android_app/build/apk/app-aligned.apk

echo "7️⃣ Signing APK..."
if [ ! -f "debug.keystore" ]; then
  keytool -genkeypair -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
fi

$BUILD_TOOLS/apksigner sign --ks debug.keystore --ks-pass pass:android --key-pass pass:android --out AakashStream.apk android_app/build/apk/app-aligned.apk

echo "🎉 SUCCESS! AakashStream.apk generated successfully at $(pwd)/AakashStream.apk"
ls -lh AakashStream.apk
