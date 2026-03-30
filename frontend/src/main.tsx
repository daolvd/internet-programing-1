import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initUserSession } from './services/CardReviewService'
import { apiClient } from './services/ApiClient'
import { initDeckData } from './services/DeckServices'

initUserSession()

async function bootstrap() {
  try {
    await apiClient.initializeAuth()
    await initDeckData()
  } catch {
    // App will render with empty arrays — user may see empty state
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
