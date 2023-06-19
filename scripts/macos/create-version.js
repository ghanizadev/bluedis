const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");

function createJWT(scope) {
  const iat = Math.trunc(Date.now() / 1000);
  const exp = iat + 60;

  const header = {
    algorithm: "ES256",
    keyid: process.env.API_KEY_ID,
  };

  const payload = {
    iss: process.env.API_ISSUER_ID,
    iat,
    exp,
    aud: "appstoreconnect-v1",
    scope,
  };

  return jwt.sign(payload, crypto.createPrivateKey(process.env.API_PRIVATE_KEY), header);
}

async function getAppVersions(appId) {
  const token = createJWT([`GET /v1/apps/${appId}/appStoreVersions`]);

  const response = await axios.get(
    `https://api.appstoreconnect.apple.com/v1/apps/${appId}/appStoreVersions`,
    {
      headers: { Authorization: "Bearer " + token },
      validateStatus: () => true,
    }
  );
  
  return response.data
}

async function getBuild(buildId) {
  const token = createJWT([
    `GET /v1/appStoreVersions/${buildId}/build`,
  ]);

  const response = await axios.get(
    `https://api.appstoreconnect.apple.com/v1/appStoreVersions/${buildId}/build`,
    {
      headers: { Authorization: "Bearer " + token },
      validateStatus: () => true,
    }
  );
  
  return response.data
}

async function run() {
  console.log(JSON.stringify(await getBuild(), null, 2))
}

run().catch(console.error);
