import {
  err,
  ok,
  partition,
  type AnyDef,
  type DataPack,
  type DataPackType,
  type ParsedJsonFile,
  type Result,
} from '@asteroid-miner/model';

export type LoadedFile = {
  path: string;
  defs: AnyDef[];
};

export type LoadedPack = {
  name: string;
  type: DataPackType;
  files: LoadedFile[];
};

const loadFile = (
  file: ParsedJsonFile<AnyDef[]>,
  packName: string,
): Result<LoadedFile, string> =>
  file.contents.ok
    ? ok({ path: file.file.path, defs: file.contents.value })
    : err(
        `Pack '${packName}' failed to load '${file.file.path}': ${file.contents.error}`,
      );

export function toLoadedPack(pack: DataPack): Result<LoadedPack, string[]> {
  if (!pack.manifest.contents.ok) {
    return err([
      `Pack at '${pack.path}' has an invalid manifest: ${pack.manifest.contents.error}`,
    ]);
  }

  const name = pack.manifest.contents.value.name;
  const type = pack.manifest.contents.value.dataPack.type;

  const { oks: files, errs } = partition(
    pack.files.map((file) => loadFile(file, name)),
  );

  return errs.length > 0 ? err(errs) : ok({ name, type, files });
}
