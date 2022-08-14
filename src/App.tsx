import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

const invoke = (window as any).__TAURI__.invoke;

function App() {
  const [count, setCount] = useState(0);
  const [response, setResponse] = useState<string>();

  const handler = async () => {
      const created = await invoke('create_zset', { cStr: 'redis://localhost:6379', key: 'new zset key' });
      console.log(created);
      setResponse(created.value);
  }

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
