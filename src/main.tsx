import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastProvider } from '@/shared/components/toast-provider';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <ToastProvider />
    </StrictMode>
);
