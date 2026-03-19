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

  ipcMain.handle('load-data-pack', async (_event, packPath: string) => {
    try {
      const [
        manifest,
        skills,
        traits,
        origins,
        careers,
        tags,
        resources,
        formations,
        asteroid_types,
      ] = await Promise.all([
        readFile(join(packPath, 'manifest.json'), 'utf-8'),
        readFile(join(packPath, 'skills.json'), 'utf-8'),
        readFile(join(packPath, 'traits.json'), 'utf-8'),
        readFile(join(packPath, 'origins.json'), 'utf-8'),
        readFile(join(packPath, 'careers.json'), 'utf-8'),
        readFile(join(packPath, 'tags.json'), 'utf-8'),
        readFile(join(packPath, 'resources.json'), 'utf-8'),
        readFile(join(packPath, 'formations.json'), 'utf-8'),
        readFile(join(packPath, 'asteroid_types.json'), 'utf-8'),
      ]);
      return {
        ok: true,
        data: {
          manifest,
          skills,
          traits,
          origins,
          careers,
          tags,
          resources,
          formations,
          asteroid_types,
        },
      };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  });

  // TODO: handle production resource path
  ipcMain.handle('get-base-data-path', () => {
    return join(app.getAppPath(), 'data', 'base');
  });
}
