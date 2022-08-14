import {useEffect, useState} from 'react'
import { listen, emit } from '@tauri-apps/api/event'
import reactLogo from './assets/react.svg'
import './App.css'

const invoke = (window as any).__TAURI__.invoke;

function App() {
  const [count, setCount] = useState(0);
  const [response, setResponse] = useState<string>();

  const handler = async () => {
      // const data = await invoke('find_keys', { cStr: 'redis://localhost:6379', pattern: '*' });
      // console.log({ data });
      // if(typeof created !== 'string') setResponse(created.value);
      emit('find-keys', { pattern: "*", cstr: 'redis://localhost:6379' })
  }

  useEffect(() => {
      if(!(window as any).callback_loaded){
          (window as any).callback_loaded = true;

          listen('data', (event) => {
              console.log("data", event.payload);
          })
              .then(unlisten => {
                  (window as any).callbacks = Array.isArray((window as any).callbacks) ? [...(window as any).callbacks, unlisten] : [unlisten];
              })
      }

      return () => {
          if((window as any).callbacks && Array.isArray((window as any).callbacks)) {
              (window as any).callbacks.forEach((cb) => cb());
          }
      }
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={handler}>
          response is {response}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
