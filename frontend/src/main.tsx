import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SocketProvider } from './context/SocketContext'

// Importar estilos globales
import './styles/variables.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
)

// Made with Bob
