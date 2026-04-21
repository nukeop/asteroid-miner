import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveGame: (data: string) => ipcRenderer.invoke('save-game', data),
  loadGame: () => ipcRenderer.invoke('load-game'),
  parseDataPack: (path: string) => ipcRenderer.invoke('parse-data-pack', path),
  getBaseDataPath: () => ipcRenderer.invoke('get-base-data-path'),
});
