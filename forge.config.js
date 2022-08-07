const path = require("path");
const fs = require("fs");

module.exports = {
  packagerConfig: {
    icon: "./assets/icon.ico",
    appBundleId: "com.ghanizadev.bluedis",
    appVersion: "0.2.1",
    dir: "./app",
    name: "Bluedis",
    out: "bundle",
    appCategoryType: "public.app-category.developer-tools",
    darwinDarkModeSupport: true,
    executableName: "bluedis",
    ignore: fs.readFileSync('.forgeignore').toString('ascii').split('/n').filter(Boolean).filter(l => !l.startsWith('#'))
  },
  makers: [
    {
      name: "@electron-forge/maker-wix",
      config: {
        language: 1033,
        manufacturer: "ghanizadev Ltd. EOOD",
        appUserModelId: "com.ghanizadev.bluedis",
        description: "A modern Redis client",
        name: "Bluedis",
        upgradeCode: "fa953509-7af1-4fae-8ae5-bd1c8c228498",
        version: "0.2.1",
        appIconPath: './assets/icon.ico',
        ui: {
          images: {
            banner: path.resolve(__dirname, "assets", "template", "banner_493x58.jpg"),
            background: path.resolve(__dirname, "assets", "template", "background_493x312.jpg")
          }
        }
      }
    },
    {
      name: "@electron-forge/maker-zip",
      config: {},
      platforms: [
        "darwin"
      ]
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        description: "A modern Redis client"
      }
    }
  ]
}