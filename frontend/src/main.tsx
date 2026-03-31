import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initUserSession } from './services/CardReviewService'
import { apiClient } from './services/ApiClient'
import { initDeckData } from './services/DeckServices'

const THEME_STORAGE_KEY = "flashcard-theme"

function applyInitialTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark

  document.documentElement.classList.toggle("dark", shouldUseDark)
}

initUserSession()
applyInitialTheme()

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
