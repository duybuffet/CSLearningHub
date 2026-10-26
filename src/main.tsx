import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

// After a deploy, an open tab may request old hashed chunks the new service worker
// no longer serves. Reload to pick up the new build — at most once per 30s so an
// offline failure can't loop (the topic page then shows its Retry state).
window.addEventListener('vite:preloadError', (event) => {
  try {
    const last = Number(sessionStorage.getItem('cs-hub-chunk-reload-at') ?? 0);
    if (Date.now() - last < 30_000) return;
    sessionStorage.setItem('cs-hub-chunk-reload-at', String(Date.now()));
  } catch {
    return; // storage blocked — fall back to the in-page Retry state
  }
  event.preventDefault();
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
