import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initTokenStorage } from '@/lib/tokenStorage'
import './index.css'

async function bootstrap() {
  await initTokenStorage()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
