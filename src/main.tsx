import { StrictMode, type JSX } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '../utils/theme'
import './global.css'
import Auth from './auth/auth';
import PageManager from './page_manager';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <Auth>
        <PageManager pageState={{ page: 'home' }} />
      </Auth>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
