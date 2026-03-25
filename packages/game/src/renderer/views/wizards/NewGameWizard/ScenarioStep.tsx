import { type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { WizardLayout } from '@asteroid-miner/ui';

import { useNewGameWizard } from '../../../hooks/newGameWizard';
import { useScenarioSelection } from '../../../hooks/useScenarioSelection';

export const ScenarioStep: FC = () => {
  const { t } = useTranslation();
  const { scenarioList, selectedId, selected, selectScenario } =
    useScenarioSelection();
  const { isLastStep, next, back } = useNewGameWizard();

  return (
    <WizardLayout
      data-testid="scenario-selection"
      labels={{
        back: t('common.back', 'Back'),
        next: t('common.next', 'Next'),
        finish: t('common.start', 'Start'),
      }}
      isLastStep={isLastStep}
      nextDisabled={!selectedId}
      onBack={back}
      onNext={next}
    >
      <div className="flex h-full">
        <div className="border-amber-dim w-64 overflow-y-auto border-r p-4">
          {scenarioList.map((scenario) => (
            <div
              key={scenario.id}
              data-testid="scenario-name"
              className={`cursor-pointer p-2 ${scenario.id === selectedId ? 'bg-amber-dim text-amber-bright' : 'text-amber-text'}`}
              onClick={() => selectScenario(scenario.id)}
            >
              {t(scenario.nameKey)}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selected && (
            <>
              <h2 className="font-heading text-amber-bright mb-4 text-2xl">
                {t(selected.nameKey)}
              </h2>
              <p data-testid="scenario-description" className="text-amber-text">
                {t(selected.descriptionKey)}
              </p>
            </>
          )}
        </div>
      </div>
    </WizardLayout>
  );
};
