#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

SDK_DIR="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/home/abhiboss/Android/Sdk}}"
BUILD_TOOLS="$SDK_DIR/build-tools/35.0.0"
if [ ! -d "$BUILD_TOOLS" ]; then
  BUILD_TOOLS=$(find "$SDK_DIR/build-tools" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort -V | tail -n 1)
fi
PLATFORM="$SDK_DIR/platforms/android-35/android.jar"
if [ ! -f "$PLATFORM" ]; then
  PLATFORM=$(find "$SDK_DIR/platforms" -name "android.jar" 2>/dev/null | sort -V | tail -n 1)
fi

echo "🚀 Building T2L (Television to Live) APK..."

echo "0️⃣ Syncing Web Assets to android_app/src/main/assets..."
rm -rf android_app/src/main/assets
mkdir -p android_app/src/main/assets
cp -f index.html android_app/src/main/assets/index.html
[ -f favicon.ico ] && cp -f favicon.ico android_app/src/main/assets/favicon.ico
cp -rf assets android_app/src/main/assets/
cp -rf data android_app/src/main/assets/
[ -f sw.js ] && cp -f sw.js android_app/src/main/assets/
[ -f manifest.json ] && cp -f manifest.json android_app/src/main/assets/
[ -f playlist.m3u ] && cp -f playlist.m3u android_app/src/main/assets/

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
  --min-sdk-version 24 --target-sdk-version 35 --auto-add-overlay

echo "3️⃣ Compiling Java Code..."
JAVA_FILES=$(find android_app/src/main/java -name "*.java")
javac --release 11 -cp $PLATFORM -d android_app/build/obj $JAVA_FILES

echo "4️⃣ Converting to DEX (d8)..."
CLASS_FILES=$(find android_app/build/obj -name "*.class")
$BUILD_TOOLS/d8 --lib $PLATFORM --output android_app/build/dex $CLASS_FILES

echo "5️⃣ Packaging DEX and Native Libraries (.so) into APK..."
python3 -c "
import zipfile, os, glob
with zipfile.ZipFile('android_app/build/apk/app-unaligned.apk', 'a') as zf:
    for dex_file in sorted(glob.glob('android_app/build/dex/*.dex')):
        zf.write(dex_file, os.path.basename(dex_file))
    for so_file in glob.glob('android_app/src/main/jniLibs/*/*.so'):
        rel = os.path.relpath(so_file, 'android_app/src/main/jniLibs')
        zf.write(so_file, 'lib/' + rel)
print('classes.dex and jniLibs added successfully!')
"

echo "6️⃣ Aligning APK (zipalign)..."
$BUILD_TOOLS/zipalign -p -f 4 android_app/build/apk/app-unaligned.apk android_app/build/apk/app-aligned.apk

echo "7️⃣ Signing APK..."
if [ ! -f "debug.keystore" ]; then
  keytool -genkeypair -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
fi

$BUILD_TOOLS/apksigner sign --ks debug.keystore --ks-pass pass:android --key-pass pass:android --out T2L.apk android_app/build/apk/app-aligned.apk
cp -f T2L.apk AakashStream.apk

echo "🎉 SUCCESS! T2L.apk generated successfully at $(pwd)/T2L.apk"
ls -lh T2L.apk
