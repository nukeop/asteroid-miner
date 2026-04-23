import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { app, type IpcMain } from 'electron';

import { err, ok } from '@asteroid-miner/model';

import { parseDataPack } from './data-pack/parseDataPack';

function getSavePath(): string {
  return join(app.getPath('userData'), 'saves', 'save.json');
}

export function registerIpcHandlers(ipcMain: IpcMain) {
  ipcMain.handle('save-game', async (_event, data: string) => {
    try {
      const savePath = getSavePath();
      await mkdir(join(savePath, '..'), { recursive: true });
      await writeFile(savePath, data, 'utf-8');
      return ok(undefined);
    } catch (e) {
      return err(String(e));
    }
  });

  ipcMain.handle('load-game', async () => {
    try {
      const data = await readFile(getSavePath(), 'utf-8');
      return ok(data);
    } catch (e) {
      return err(String(e));
    }
  });

  ipcMain.handle('parse-data-pack', async (_event, packPath: string) => {
    return parseDataPack(packPath);
  });

  // TODO: handle production resource path
  ipcMain.handle('get-base-data-path', () => {
    return join(app.getAppPath(), 'data', 'base');
  });
}
