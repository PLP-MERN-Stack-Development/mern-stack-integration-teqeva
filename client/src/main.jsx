import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Import Tailwind CSS base styles
import { AuthProvider } from './context/AuthContext.jsx' // <-- NEW IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- WRAP APP WITH CONTEXT */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)