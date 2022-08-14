interface IService {
  invoke: (event: string, args: { [key: string]: string | number | boolean }) => void;
}

const services: IService = {
  // receive: () => {},
  // send: () => {},
  invoke: window.__TAURI__.invoke,
  // shell: () => {},
};


export default services;

