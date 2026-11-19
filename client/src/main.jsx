import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter makes the URL available to <Routes>/<NavLink> everywhere below it */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
