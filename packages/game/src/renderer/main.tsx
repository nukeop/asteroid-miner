import '@asteroid-miner/i18n';
import '@asteroid-miner/tailwind-config';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { initWasm } from './wasm';

await initWasm();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
