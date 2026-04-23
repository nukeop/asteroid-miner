import {
  ok,
  type AnyDef,
  type DataPack,
  type DataPackManifestContents,
  type ParsedJsonFile,
} from '@asteroid-miner/model';

type DefFile = {
  filename: string;
  defs: AnyDef[];
};

export class DataPackBuilder {
  private name = 'test-pack';
  private version = '0.1.0';
  private defFiles: DefFile[] = [];

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withGameVersion(version: string): this {
    this.version = version;
    return this;
  }

  withDefFile(filename: string, defs: AnyDef[]): this {
    this.defFiles.push({ filename, defs });
    return this;
  }

  withDefs(defs: AnyDef[]): this {
    return this.withDefFile('defs/all.json', defs);
  }

  build(): DataPack {
    const path = `/fake/packs/${this.name}`;
    const manifestContents: DataPackManifestContents = {
      name: this.name,
      dataPack: {
        files: this.defFiles.map((f) => f.filename),
        gameVersion: this.version,
        nameKey: `pack.${this.name}.name`,
        descriptionKey: `pack.${this.name}.description`,
      },
    };

    const manifestPath = `${path}/package.json`;
    const manifestText = JSON.stringify(manifestContents, null, 2);
    const manifest: ParsedJsonFile<DataPackManifestContents> = {
      file: { path: manifestPath, text: ok(manifestText) },
      contents: ok(manifestContents),
    };

    const files: ParsedJsonFile<AnyDef[]>[] = this.defFiles.map(
      ({ filename, defs }) => ({
        file: {
          path: `${path}/${filename}`,
          text: ok(JSON.stringify(defs, null, 2)),
        },
        contents: ok(defs),
      }),
    );

    return { path, manifest, files };
  }
}
