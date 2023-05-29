set -a; source ../../.env; set +a

cp "$CONFIG_FOLDER"/"$PROVISION_PROFILE" "$APP_DIR"/"$APP_NAME"/Contents
mv "$APP_DIR"/"$APP_NAME"/Contents/"$PROVISION_PROFILE" "$APP_DIR"/"$APP_NAME"/Contents/embedded.provisionprofile

codesign --sign "$SIGN_ID" --entitlements "$CONFIG_FOLDER"/entitlements.plist --options=runtime "$APP_DIR"/"$APP_NAME"

productbuild --sign "$SIGN_INST_ID" --component "$APP_DIR"/"$APP_NAME" /Applications "$APP_DIR"/package.pkg