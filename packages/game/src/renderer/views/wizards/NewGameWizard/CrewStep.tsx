import { useCallback, type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { Button, Input, SkillBars, WizardLayout } from '@asteroid-miner/ui';

import { useNewGameWizard } from '../../../hooks/newGameWizard';
import { useCrewReview } from '../../../hooks/useCrewReview';
import { useGameStateStore } from '../../../stores/useGameStateStore';

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
  const updateCrewMemberName = useGameStateStore((s) => s.updateCrewMemberName);

  const handleBack = useCallback(() => {
    resetGame();
    back();
  }, [resetGame, back]);

  const updateName = (
    field: 'firstName' | 'middleName' | 'lastName' | 'nickname',
    value: string,
  ) => {
    if (selectedPawn) {
      updateCrewMemberName(selectedPawn.id, { [field]: value });
    }
  };

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
      <div className="border-crt-muted w-64 overflow-y-auto border-r p-4">
        {crewList.map((member, index) => {
          const fullName =
            `${member.pawn.firstName} ${member.pawn.lastName}`.trim();
          return (
            <button
              type="button"
              key={member.id}
              data-testid="crew-list-name"
              className={`block w-full cursor-pointer p-2 text-left ${member.isSelected ? 'bg-crt-muted text-crt-bright' : 'text-crt-text'}`}
              onClick={() => selectCrewMember(index)}
            >
              {fullName || (
                <span className="italic opacity-50">
                  {t('newGame.crewReview.unnamed')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-6" data-testid="crew-detail">
          {selectedPawn && defs && (
            <>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="grid flex-1 grid-cols-4 gap-3">
                  <Input
                    value={selectedPawn.firstName}
                    onChange={(e) => updateName('firstName', e.target.value)}
                    placeholder={t('newGame.crewReview.firstName')}
                    aria-label={t('newGame.crewReview.firstName')}
                  />
                  <Input
                    value={selectedPawn.middleName}
                    onChange={(e) => updateName('middleName', e.target.value)}
                    placeholder={t('newGame.crewReview.middleName')}
                    aria-label={t('newGame.crewReview.middleName')}
                  />
                  <Input
                    value={selectedPawn.lastName}
                    onChange={(e) => updateName('lastName', e.target.value)}
                    placeholder={t('newGame.crewReview.lastName')}
                    aria-label={t('newGame.crewReview.lastName')}
                  />
                  <Input
                    value={selectedPawn.nickname ?? ''}
                    onChange={(e) => updateName('nickname', e.target.value)}
                    placeholder={t('newGame.crewReview.nickname')}
                    aria-label={t('newGame.crewReview.nickname')}
                  />
                </div>
                <Button variant="secondary" onClick={reroll}>
                  {t('newGame.crewReview.reroll')}
                </Button>
              </div>

              <p className="text-crt-text/70 mb-6">
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
                    <p className="text-crt-text text-sm">
                      {selectedPawn.traits.length > 0
                        ? selectedPawn.traits.join(', ')
                        : t('newGame.crewReview.noTraits')}
                    </p>
                  </div>
                </div>

                <div className="flex-2/3">
                  <SkillBars skills={skills} className="max-w-80" />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="border-crt-muted w-full border-t p-6">
          <h2 className="text-crt-bright mb-4">
            {t('newGame.crewReview.teamSkills')}
          </h2>
          <SkillBars skills={teamSkills} />
        </div>
      </div>
    </WizardLayout>
  );
};
