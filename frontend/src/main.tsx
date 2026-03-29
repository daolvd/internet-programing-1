import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initUserSession } from './services/CardReviewService'
import { apiClient } from './services/ApiClient'

initUserSession()
void apiClient.initializeAuth().catch(() => {
  // Defer hard failure handling to first API request.
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
