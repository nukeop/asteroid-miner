import { readFile } from 'node:fs/promises';

import { type Mock } from 'vitest';

let fileMap: Record<string, string> = {};
let errorMap: Record<string, Error> = {};

const installImplementation = () => {
  (readFile as Mock).mockImplementation(async (path: string) => {
    const error = errorMap[path];
    if (error) {
      throw error;
    }

    const contents = fileMap[path];
    if (!contents) {
      throw new Error(`readFile called for unknown path: ${path}`);
    }

    return contents;
  });
};

export const FsMock = {
  setFiles: (files: Record<string, string>) => {
    fileMap = { ...fileMap, ...files };
    installImplementation();
  },
  setFileError: (path: string, error: Error) => {
    errorMap = { ...errorMap, [path]: error };
    installImplementation();
  },
  reset: () => {
    fileMap = {};
    errorMap = {};
    (readFile as Mock).mockClear();
    installImplementation();
  },
};
