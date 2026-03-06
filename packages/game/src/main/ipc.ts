import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { app, type IpcMain } from 'electron';

function getSavePath(): string {
  return join(app.getPath('userData'), 'saves', 'save.json');
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
}
