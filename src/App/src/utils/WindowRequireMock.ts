
const mocks = {
  ipcRenderer: { on: jest.fn(), send: jest.fn() } 
}

Object.defineProperty(window, "require", {
  writable: true,
  value: jest.fn().mockImplementation((query) => {
    return mocks;
  }),
});

const writeText = jest.fn().mockResolvedValue(null);

const createObjectURL = jest.fn((data: Blob) => {
  return Blob.toString();
}
);

Object.defineProperty(window, "URL", {
  writable: true,
  value: {
    createObjectURL
  }
})

Object.defineProperty(global.navigator, "clipboard", {
  writable: true,
  value: {writeText}
})

const functions = {
  ...mocks,
  writeText,
  createObjectURL
}

export default functions;
