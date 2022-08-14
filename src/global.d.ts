declare global {
  interface Window {
    ipc: any;
    __TAURI__: any;
  }
}

export {};
