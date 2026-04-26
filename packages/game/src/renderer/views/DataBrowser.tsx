import { useNavigate } from '@tanstack/react-router';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { Button, DataTable, type ColumnDef } from '@asteroid-miner/ui';

import { useDefinitionsStore } from '../stores';

export const DataBrowser: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const definitions = useDefinitionsStore((s) => s.definitions);

  const skills = useMemo(
    () => Object.values(definitions?.skills ?? {}),
    [definitions],
  );
  const traits = useMemo(
    () => Object.values(definitions?.traits ?? {}),
    [definitions],
  );
  const origins = useMemo(
    () => Object.values(definitions?.origins ?? {}),
    [definitions],
  );
  const careers = useMemo(
    () => Object.values(definitions?.careers ?? {}),
    [definitions],
  );
  const tags = useMemo(
    () => Object.values(definitions?.tags ?? {}),
    [definitions],
  );
  const resources = useMemo(
    () => Object.values(definitions?.resources ?? {}),
    [definitions],
  );
  const formations = useMemo(
    () => Object.values(definitions?.formations ?? {}),
    [definitions],
  );
  const asteroidTypes = useMemo(
    () => Object.values(definitions?.asteroidTypes ?? {}),
    [definitions],
  );
  const shipModules = useMemo(
    () => Object.values(definitions?.shipModules ?? {}),
    [definitions],
  );
  const machines = useMemo(
    () => Object.values(definitions?.machines ?? {}),
    [definitions],
  );
  const scenarios = useMemo(
    () => Object.values(definitions?.scenarios ?? {}),
    [definitions],
  );
  const zones = useMemo(
    () => Object.values(definitions?.zones ?? {}),
    [definitions],
  );
  const zoneConnections = useMemo(
    () => Object.values(definitions?.zoneConnections ?? {}),
    [definitions],
  );
  const namePools = useMemo(
    () => Object.values(definitions?.namePools ?? {}),
    [definitions],
  );

  const skillColumns = useMemo<ColumnDef<(typeof skills)[number], unknown>[]>(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      { accessorKey: 'xpBase', header: t('data.columns.xpBase') },
      { accessorKey: 'xpGrowth', header: t('data.columns.xpGrowth') },
    ],
    [t],
  );

  const traitColumns = useMemo<ColumnDef<(typeof traits)[number], unknown>[]>(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'effects',
        header: t('data.columns.effects'),
        accessorFn: (row) =>
          [
            ...(row.skillModifiers ?? []).map(
              (m) => `${m.op} ${m.skill} ${m.value}`,
            ),
            ...(row.customEffects ?? []).map((e) => e.handler),
          ].join(', ') || '\u2014',
      },
    ],
    [t],
  );

  type BackgroundRow = (typeof origins)[number] | (typeof careers)[number];
  const backgroundColumns = useMemo<ColumnDef<BackgroundRow, unknown>[]>(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'bonuses',
        header: t('data.columns.bonuses'),
        accessorFn: (row) =>
          row.skillBonuses
            .map((b) => `${b.id} ${b.amount > 0 ? '+' : ''}${b.amount}`)
            .join(', ') || '\u2014',
      },
    ],
    [t],
  );

  const tagColumns = useMemo<ColumnDef<(typeof tags)[number], unknown>[]>(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
    ],
    [t],
  );

  const resourceColumns = useMemo<
    ColumnDef<(typeof resources)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'tags',
        header: t('data.columns.tags'),
        accessorFn: (row) => row.tags.join(', ') || '\u2014',
      },
    ],
    [t],
  );

  const formationColumns = useMemo<
    ColumnDef<(typeof formations)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'matrixResource',
        header: t('data.columns.matrixResource'),
        accessorFn: (row) => row.matrixResource,
      },
      {
        id: 'embeddedResources',
        header: t('data.columns.embeddedResources'),
        accessorFn: (row) =>
          row.embeddedResources
            .map(
              (r) =>
                `${r.resource} (${r.minGrade}-${r.maxGrade}, p=${r.probability})`,
            )
            .join(', ') || '\u2014',
      },
    ],
    [t],
  );

  const asteroidTypeColumns = useMemo<
    ColumnDef<(typeof asteroidTypes)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'massClasses',
        header: t('data.columns.massClasses'),
        accessorFn: (row) => row.massClasses.map((mc) => mc.id).join(', '),
      },
      {
        id: 'formations',
        header: t('data.columns.formations'),
        accessorFn: (row) =>
          row.formations
            .map((f) => `${f.formation} (w=${f.weight})`)
            .join(', '),
      },
    ],
    [t],
  );

  const shipModuleColumns = useMemo<
    ColumnDef<(typeof shipModules)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'category',
        header: t('data.columns.category'),
        accessorFn: (row) => row.category,
      },
      {
        id: 'details',
        header: t('data.columns.details'),
        accessorFn: (row) => {
          const skip = new Set([
            'id',
            'type',
            'category',
            'nameKey',
            'descriptionKey',
          ]);
          return (
            Object.entries(row)
              .filter(([k]) => !skip.has(k))
              .map(([k, v]) => `${k}=${String(v)}`)
              .join(', ') || '\u2014'
          );
        },
      },
    ],
    [t],
  );

  const machineColumns = useMemo<
    ColumnDef<(typeof machines)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'category',
        header: t('data.columns.category'),
        accessorFn: (row) => row.category,
      },
      {
        id: 'details',
        header: t('data.columns.details'),
        accessorFn: (row) => {
          const skip = new Set([
            'id',
            'type',
            'category',
            'nameKey',
            'descriptionKey',
          ]);
          return (
            Object.entries(row)
              .filter(([k]) => !skip.has(k))
              .map(([k, v]) => `${k}=${String(v)}`)
              .join(', ') || '\u2014'
          );
        },
      },
    ],
    [t],
  );

  const scenarioColumns = useMemo<
    ColumnDef<(typeof scenarios)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
      {
        id: 'crew',
        header: t('data.columns.crew'),
        accessorFn: (row) => `${row.crew.length} crew slots`,
      },
    ],
    [t],
  );

  const zoneColumns = useMemo<ColumnDef<(typeof zones)[number], unknown>[]>(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'name',
        header: t('data.columns.name'),
        accessorFn: (row) => t(row.nameKey),
      },
      {
        id: 'description',
        header: t('data.columns.description'),
        accessorFn: (row) => t(row.descriptionKey),
      },
    ],
    [t],
  );

  const zoneConnectionColumns = useMemo<
    ColumnDef<(typeof zoneConnections)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'zones',
        header: t('data.columns.zones'),
        accessorFn: (row) => `${row.zones[0]} \u2194 ${row.zones[1]}`,
      },
      { accessorKey: 'deltaV', header: t('data.columns.deltaV') },
      { accessorKey: 'days', header: t('data.columns.days') },
    ],
    [t],
  );

  const namePoolColumns = useMemo<
    ColumnDef<(typeof namePools)[number], unknown>[]
  >(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      {
        id: 'nameCounts',
        header: t('data.columns.nameCounts'),
        accessorFn: (row) =>
          [
            `maleFirst: ${row.maleFirst.length}`,
            `femaleFirst: ${row.femaleFirst.length}`,
            `maleMiddle: ${row.maleMiddle.length}`,
            `femaleMiddle: ${row.femaleMiddle.length}`,
            `maleLast: ${row.maleLast.length}`,
            `femaleLast: ${row.femaleLast.length}`,
          ].join(', '),
      },
    ],
    [t],
  );

  if (!definitions) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col gap-6 overflow-y-auto p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          {t('common.back')}
        </Button>
        <h1 className="font-heading text-2xl tracking-widest uppercase">
          {t('data.title')}
        </h1>
      </div>

      <Section title={t('data.skills')}>
        <DataTable
          data={skills}
          columns={skillColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.skills')}
        />
      </Section>

      <Section title={t('data.traits')}>
        <DataTable
          data={traits}
          columns={traitColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.traits')}
        />
      </Section>

      <Section title={t('data.origins')}>
        <DataTable
          data={origins}
          columns={backgroundColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.origins')}
        />
      </Section>

      <Section title={t('data.careers')}>
        <DataTable
          data={careers}
          columns={backgroundColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.careers')}
        />
      </Section>

      <Section title={t('data.tags')}>
        <DataTable
          data={tags}
          columns={tagColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.tags')}
        />
      </Section>

      <Section title={t('data.resources')}>
        <DataTable
          data={resources}
          columns={resourceColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.resources')}
        />
      </Section>

      <Section title={t('data.formations')}>
        <DataTable
          data={formations}
          columns={formationColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.formations')}
        />
      </Section>

      <Section title={t('data.asteroidTypes')}>
        <DataTable
          data={asteroidTypes}
          columns={asteroidTypeColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.asteroidTypes')}
        />
      </Section>

      <Section title={t('data.shipModules')}>
        <DataTable
          data={shipModules}
          columns={shipModuleColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.shipModules')}
        />
      </Section>

      <Section title={t('data.machines')}>
        <DataTable
          data={machines}
          columns={machineColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.machines')}
        />
      </Section>

      <Section title={t('data.scenarios')}>
        <DataTable
          data={scenarios}
          columns={scenarioColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.scenarios')}
        />
      </Section>

      <Section title={t('data.zones')}>
        <DataTable
          data={zones}
          columns={zoneColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.zones')}
        />
      </Section>

      <Section title={t('data.zoneConnections')}>
        <DataTable
          data={zoneConnections}
          columns={zoneConnectionColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.zoneConnections')}
        />
      </Section>

      <Section title={t('data.namePools')}>
        <DataTable
          data={namePools}
          columns={namePoolColumns}
          getRowId={(row) => row.id}
          aria-label={t('data.namePools')}
        />
      </Section>
    </div>
  );
};

const Section: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="flex flex-col gap-2">
    <h2 className="font-heading text-lg tracking-wider uppercase">{title}</h2>
    <div className="max-h-80">{children}</div>
  </section>
);
