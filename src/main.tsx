import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { Toaster } from 'react-hot-toast';   // ✅ ADD THIS

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" />   {/* ✅ ADD THIS */}
  </StrictMode>
);
