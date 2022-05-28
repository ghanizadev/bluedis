const path = require("path");
module.exports = {
  testMatch: ['**/app/**/*.spec.ts'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: path.resolve(__dirname, '..', 'tsconfig.app.json')
    }
  }
}