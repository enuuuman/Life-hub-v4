import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// CSSの直接注入（Viteのデフォルト動作に合わせて Tailwind ディレクティブを含む）
const style = document.createElement('style');
style.textContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .pt-safe-top { padding-top: env(safe-area-inset-top); }
  .pb-safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
}
`;
document.head.appendChild(style);

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.log('SW Registration failed: ', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
