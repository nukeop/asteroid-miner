import { useEffect, useState } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { Button } from '@asteroid-miner/ui';

import init, { ping } from '../../../simulation/pkg/asteroid_miner_simulation';

declare global {
  interface Window {
    electronAPI: {
      saveGame: (data: string) => Promise<{ ok: boolean }>;
      loadGame: () => Promise<{ ok: boolean; data: string | null }>;
    };
  }
}

export function App() {
  const { t } = useTranslation();
  const [wasmStatus, setWasmStatus] = useState<string>('...');
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    init()
      .then(() => {
        const result = JSON.parse(ping());
        setWasmStatus(`${result.engine} v${result.version} - ${result.status}`);
      })
      .catch((e) => {
        setWasmStatus(`error: ${e}`);
      });
  }, []);

  const handleSave = async () => {
    const testData = JSON.stringify({ timestamp: Date.now() });
    const result = await window.electronAPI.saveGame(testData);
    setSaveStatus(result.ok ? 'saved' : 'save failed');
  };

  const handleLoad = async () => {
    const result = await window.electronAPI.loadGame();
    setSaveStatus(result.ok ? `loaded: ${result.data}` : 'no save found');
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-primary font-mono text-2xl">{t('common.newGame')}</h1>

      <div className="border-border bg-surface flex flex-col gap-2 rounded-md border p-4 font-mono text-sm">
        <span className="text-foreground-muted">wasm:</span>
        <span className="text-primary">{wasmStatus}</span>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave}>{t('common.save')}</Button>
        <Button variant="secondary" onClick={handleLoad}>
          {t('common.load')}
        </Button>
      </div>

      {saveStatus && (
        <span className="text-foreground-muted font-mono text-xs">
          {saveStatus}
        </span>
      )}
    </div>
  );
}
