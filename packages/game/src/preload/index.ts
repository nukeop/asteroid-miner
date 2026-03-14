import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveGame: (data: string) => ipcRenderer.invoke('save-game', data),
  loadGame: () => ipcRenderer.invoke('load-game'),
  loadDataPack: (packPath: string) =>
    ipcRenderer.invoke('load-data-pack', packPath),
  getBaseDataPath: () => ipcRenderer.invoke('get-base-data-path'),
});
