import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { registerServiceWorker } from './platform/pwa';
import './styles/main.css';
import './styles/generated-art.css';
import './styles/visual-assets.css';
import './styles/mining-damage.css';
import './styles/mining-wall-overlays.css';

registerServiceWorker();

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
