if [ -f "$1" ]; then
    set -a; source $1; set +a
fi

xcrun notarytool submit --apple-id "$APPLE_ID" --password "$APPLE_PASSWORD" --team-id "$APPLE_PROVIDER_SHORT_NAME" --wait "$APP_DIR"/package.pkg
xcrun stapler staple "$APP_DIR"/package.pkg
spctl --assess -vv --type install "$APP_DIR"/package.pkg
