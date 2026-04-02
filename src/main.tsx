import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './utils/theme';
import './global.css';
import ThemeSelector from './components/theme_selector';
import Auth from './auth/auth';
import PageManager from './page_manager';

function App() {
    return (
        <React.StrictMode>
            <ThemeProvider>
                <Auth>
                    <PageManager pageState={{ page: 'home' }} />
                </Auth>
                <ThemeSelector />
            </ThemeProvider>
        </React.StrictMode>
    );
}

// เชื่อมต่อกับ <div id="root"></div> ใน index.html
const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}
