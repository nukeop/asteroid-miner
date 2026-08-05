import {
  err,
  ok,
  type AnyDef,
  type DataPack,
  type DataPackManifestContents,
  type DataPackType,
  type ParsedJsonFile,
} from '@asteroid-miner/model';

type OkVirtualFile = { filename: string; kind: 'ok'; defs: AnyDef[] };
type FailedVirtualFile = { filename: string; kind: 'failed'; error: string };
type VirtualFile = OkVirtualFile | FailedVirtualFile;

const isOkFile = (file: VirtualFile): file is OkVirtualFile =>
  file.kind === 'ok';

export class DataPackBuilder {
  private name = 'test-pack';
  private type: DataPackType = 'mod';
  private nameKey = 'pack.test.name';
  private descriptionKey = 'pack.test.description';
  private version = '0.1.0';
  private files: VirtualFile[] = [];
  private manifestContentsError: string | null = null;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withType(type: DataPackType): this {
    this.type = type;
    return this;
  }

  withNameKey(nameKey: string): this {
    this.nameKey = nameKey;
    return this;
  }

  withDescriptionKey(descriptionKey: string): this {
    this.descriptionKey = descriptionKey;
    return this;
  }

  withGameVersion(version: string): this {
    this.version = version;
    return this;
  }

  withDefs(filename: string, defs: AnyDef[]): this {
    const existing = this.files
      .filter(isOkFile)
      .find((file) => file.filename === filename);
    if (existing) {
      existing.defs.push(...defs);
      return this;
    }
    this.files.push({ filename, kind: 'ok', defs: [...defs] });
    return this;
  }

  withFailedDefFile(filename: string, error: string): this {
    this.files.push({ filename, kind: 'failed', error });
    return this;
  }

  withFailedManifestContents(error: string): this {
    this.manifestContentsError = error;
    return this;
  }

  build(): DataPack {
    const packPath = `/fake/packs/${this.name}`;
    const manifestPath = `${packPath}/package.json`;
    return {
      path: packPath,
      manifest: this.buildManifest(manifestPath),
      files: this.files.map((entry) => this.buildFile(entry, packPath)),
    };
  }

  private buildManifest(
    manifestPath: string,
  ): ParsedJsonFile<DataPackManifestContents> {
    if (this.manifestContentsError !== null) {
      return {
        file: { path: manifestPath, text: ok('') },
        contents: err(this.manifestContentsError),
      };
    }
    const contents: DataPackManifestContents = {
      name: this.name,
      dataPack: {
        type: this.type,
        files: this.files.map((entry) => entry.filename),
        gameVersion: this.version,
        nameKey: this.nameKey,
        descriptionKey: this.descriptionKey,
      },
    };
    return {
      file: {
        path: manifestPath,
        text: ok(JSON.stringify(contents, null, 2)),
      },
      contents: ok(contents),
    };
  }

  private buildFile(
    entry: VirtualFile,
    packPath: string,
  ): ParsedJsonFile<AnyDef[]> {
    const filePath = `${packPath}/${entry.filename}`;
    if (entry.kind === 'failed') {
      return {
        file: { path: filePath, text: ok('') },
        contents: err(entry.error),
      };
    }
    return {
      file: {
        path: filePath,
        text: ok(JSON.stringify(entry.defs, null, 2)),
      },
      contents: ok(entry.defs),
    };
  }
}
