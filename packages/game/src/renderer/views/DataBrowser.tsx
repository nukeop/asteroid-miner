import { useMemo, type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { DataTable, type ColumnDef } from '@asteroid-miner/ui';

import { useDefinitionsStore } from '../stores';

export const DataBrowser: FC = () => {
  const { t } = useTranslation();
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

  const skillColumns = useMemo<ColumnDef<(typeof skills)[number], unknown>[]>(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      { accessorKey: 'name', header: t('data.columns.name') },
      { accessorKey: 'description', header: t('data.columns.description') },
      { accessorKey: 'xpBase', header: t('data.columns.xpBase') },
      { accessorKey: 'xpGrowth', header: t('data.columns.xpGrowth') },
    ],
    [t],
  );

  const traitColumns = useMemo<ColumnDef<(typeof traits)[number], unknown>[]>(
    () => [
      { accessorKey: 'id', header: t('data.columns.id') },
      { accessorKey: 'name', header: t('data.columns.name') },
      { accessorKey: 'description', header: t('data.columns.description') },
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
      { accessorKey: 'name', header: t('data.columns.name') },
      { accessorKey: 'description', header: t('data.columns.description') },
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

  if (!definitions) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col gap-6 overflow-y-auto p-4">
      <h1 className="font-heading text-2xl tracking-widest uppercase">
        {t('data.title')}
      </h1>

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
