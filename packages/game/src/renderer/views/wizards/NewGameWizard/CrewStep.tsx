import { useCallback, type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { Button, SkillBars, WizardLayout } from '@asteroid-miner/ui';

import { useNewGameWizard } from '../../../hooks/newGameWizard';
import { useCrewReview } from '../../../hooks/useCrewReview';

export const CrewStep: FC = () => {
  const { t } = useTranslation();
  const { isLastStep, next, back } = useNewGameWizard();
  const {
    defs,
    crewList,
    selectedPawn,
    skills,
    teamSkills,
    selectCrewMember,
    reroll,
    resetGame,
  } = useCrewReview();

  const handleBack = useCallback(() => {
    resetGame();
    back();
  }, [resetGame, back]);

  return (
    <WizardLayout
      data-testid="crew-review"
      labels={{
        back: t('common.back'),
        next: t('common.next'),
        finish: t('common.start'),
      }}
      isLastStep={isLastStep}
      onBack={handleBack}
      onNext={next}
    >
      <div className="border-amber-dim w-64 overflow-y-auto border-r p-4">
        {crewList.map((member, index) => (
          <button
            type="button"
            key={member.id}
            data-testid="crew-list-name"
            className={`block w-full cursor-pointer p-2 text-left ${member.isSelected ? 'bg-amber-dim text-amber-bright' : 'text-amber-text'}`}
            onClick={() => selectCrewMember(index)}
          >
            {member.pawn.firstName} {member.pawn.lastName}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-6" data-testid="crew-detail">
          {selectedPawn && defs && (
            <>
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-heading text-amber-bright text-2xl">
                  {selectedPawn.firstName} {selectedPawn.middleName}
                </h2>
                <Button variant="secondary" onClick={reroll}>
                  {t('newGame.crewReview.reroll')}
                </Button>
              </div>

              <p className="text-amber-text/70 mb-6">
                {selectedPawn.sex === 'Male'
                  ? t('newGame.crewReview.male')
                  : t('newGame.crewReview.female')}{' '}
                {t(defs.careers[selectedPawn.career].nameKey).toLowerCase()}
                {', '}
                {t('newGame.crewReview.age')} {selectedPawn.age}
              </p>

              <div className="flex w-full flex-row">
                <div className="flex flex-1/3 flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h2>{t('newGame.crewReview.backstory')}</h2>
                    <div>
                      {t('newGame.crewReview.origin')}:
                      {t(`origin.${selectedPawn.origin}.name`)}
                    </div>
                    <div>
                      {t('newGame.crewReview.career')}:
                      {t(`career.${selectedPawn.career}.name`)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2>{t('newGame.crewReview.traits')}</h2>
                    <p className="text-amber-text text-sm">
                      {selectedPawn.traits.length > 0
                        ? selectedPawn.traits.join(', ')
                        : t('newGame.crewReview.noTraits')}
                    </p>
                  </div>
                </div>

                <div className="flex-2/3">
                  <SkillBars skills={skills} className="max-w-60" />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="border-amber-dim w-full border-t p-6">
          <h2 className="text-amber-bright mb-4">
            {t('newGame.crewReview.teamSkills')}
          </h2>
          <SkillBars skills={teamSkills} />
        </div>
      </div>
    </WizardLayout>
  );
};
