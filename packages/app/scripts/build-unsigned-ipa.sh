#!/usr/bin/env bash
# Build an UNSIGNED iOS .ipa for sideloading / self-signing.
#
# Produces a device (arm64) build with code signing disabled, then repackages
# the .app into a Payload/ zip named *.ipa. The output is NOT signed — re-sign
# it with your own certificate/provisioning profile before installing.
#
# Requirements (must be present BEFORE running):
#   - Full Xcode (not just Command Line Tools). Verify: xcodebuild -version
#   - CocoaPods on PATH. Verify: pod --version
#
# Usage:
#   bash scripts/build-unsigned-ipa.sh                 # production variant (sh.paseo)
#   APP_VARIANT=development bash scripts/build-unsigned-ipa.sh
#   BUNDLE_ID=com.example.paseo bash scripts/build-unsigned-ipa.sh
set -euo pipefail

cd "$(dirname "$0")/.."
APP_DIR="$(pwd)"

export APP_VARIANT="${APP_VARIANT:-production}"
OUTPUT_DIR="${OUTPUT_DIR:-$APP_DIR/build-output}"

echo "==> Preflight"
command -v xcodebuild >/dev/null 2>&1 || { echo "ERROR: full Xcode not installed (xcodebuild missing)."; exit 1; }
command -v pod >/dev/null 2>&1 || { echo "ERROR: CocoaPods not installed (pod missing)."; exit 1; }
xcodebuild -version | head -1
echo "CocoaPods $(pod --version)"
echo "APP_VARIANT=$APP_VARIANT"

echo "==> Generating native iOS project (expo prebuild --clean)"
npx expo prebuild --platform ios --clean --no-install

# Optionally override the bundle identifier (useful to match your signing profile).
if [[ -n "${BUNDLE_ID:-}" ]]; then
  echo "==> Overriding bundle identifier -> $BUNDLE_ID"
  /usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $BUNDLE_ID" \
    "$APP_DIR"/ios/*/Info.plist 2>/dev/null || true
fi

echo "==> Installing pods"
( cd ios && pod install )

WORKSPACE="$(ls -d ios/*.xcworkspace | head -1)"
SCHEME="$(basename "$WORKSPACE" .xcworkspace)"
echo "==> Building (UNSIGNED): workspace=$WORKSPACE scheme=$SCHEME"

DERIVED="$APP_DIR/ios/build"
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath "$DERIVED" \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGN_ENTITLEMENTS="" \
  clean build

APP_PATH="$DERIVED/Build/Products/Release-iphoneos/$SCHEME.app"
[[ -d "$APP_PATH" ]] || { echo "ERROR: built .app not found at $APP_PATH"; exit 1; }

echo "==> Packaging unsigned .ipa"
mkdir -p "$OUTPUT_DIR"
STAGE="$(mktemp -d)"
mkdir -p "$STAGE/Payload"
cp -R "$APP_PATH" "$STAGE/Payload/"
IPA="$OUTPUT_DIR/$SCHEME-unsigned.ipa"
rm -f "$IPA"
( cd "$STAGE" && zip -qry "$IPA" Payload )
rm -rf "$STAGE"

echo ""
echo "Done. Unsigned IPA: $IPA"
echo "Re-sign it with your certificate before installing, e.g.:"
echo "  unzip -q \"$IPA\" -d resign && codesign -f -s \"<Your Cert>\" --entitlements <your.entitlements> resign/Payload/$SCHEME.app && (cd resign && zip -qry ../$SCHEME-signed.ipa Payload)"
