import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles.css';
const publishableKey=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const app=<BrowserRouter><App authEnabled={Boolean(publishableKey)}/></BrowserRouter>;
createRoot(document.getElementById('root')).render(publishableKey?<ClerkProvider publishableKey={publishableKey}>{app}</ClerkProvider>:app);
