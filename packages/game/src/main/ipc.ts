import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { app, type IpcMain } from 'electron';

import type {
  DataFileName,
  DataPackFiles,
  DataPackManifest,
} from '@asteroid-miner/model';

function getSavePath(): string {
  return join(app.getPath('userData'), 'saves', 'save.json');
}

async function readDataFiles(
  packPath: string,
  files: DataFileName[],
): Promise<Partial<Record<DataFileName, string>>> {
  const entries = await Promise.all(
    files.map(async (name) => {
      const content = await readFile(join(packPath, `${name}.json`), 'utf-8');
      return [name, content] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export function registerIpcHandlers(ipcMain: IpcMain) {
  ipcMain.handle('save-game', async (_event, data: string) => {
    const savePath = getSavePath();
    await mkdir(join(savePath, '..'), { recursive: true });
    await writeFile(savePath, data, 'utf-8');
    return { ok: true };
  });

  ipcMain.handle('load-game', async () => {
    try {
      const data = await readFile(getSavePath(), 'utf-8');
      return { ok: true, data };
    } catch {
      return { ok: false, data: null };
    }
  });

  ipcMain.handle(
    'load-data-pack',
    async (
      _event,
      packPath: string,
    ): Promise<
      { ok: true; data: DataPackFiles } | { ok: false; error: string }
    > => {
      try {
        const manifestRaw = await readFile(
          join(packPath, 'package.json'),
          'utf-8',
        );
        const manifest: DataPackManifest = JSON.parse(manifestRaw);
        const dataFiles = await readDataFiles(
          packPath,
          manifest.asteroidMiner.files,
        );
        return { ok: true, data: { manifest: manifestRaw, ...dataFiles } };
      } catch (e) {
        return { ok: false, error: String(e) };
      }
    },
  );

  // TODO: handle production resource path
  ipcMain.handle('get-base-data-path', () => {
    return join(app.getAppPath(), 'data', 'base');
  });
}
