import updateElectronApp from 'update-electron-app'

export const updater = () => updateElectronApp({
  repo: 'ghanizadev/bluedis',
  updateInterval: '1 hour',
})