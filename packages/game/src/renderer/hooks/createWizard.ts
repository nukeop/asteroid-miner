import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { create } from 'zustand';

type WizardConfig<TState> = {
  routes: string[];
  initialState: TState;
  onExit?: string;
  onFinishRoute: string;
  onFinish?: (state: TState) => void;
};

type WizardStore<TState> = {
  stepIndex: number;
  state: TState;
  setState: (partial: Partial<TState>) => void;
  advance: () => void;
  goBack: () => void;
  reset: () => void;
};

export function createWizard<TState>(config: WizardConfig<TState>) {
  const {
    routes,
    initialState,
    onExit = '/',
    onFinishRoute,
    onFinish,
  } = config;

  const useStore = create<WizardStore<TState>>()((set) => ({
    stepIndex: 0,
    state: { ...initialState },
    setState: (partial) =>
      set((prev) => ({ state: { ...prev.state, ...partial } })),
    advance: () =>
      set((prev) => ({
        stepIndex: Math.min(prev.stepIndex + 1, routes.length - 1),
      })),
    goBack: () =>
      set((prev) => ({ stepIndex: Math.max(prev.stepIndex - 1, 0) })),
    reset: () => set({ stepIndex: 0, state: { ...initialState } }),
  }));

  function useWizard() {
    const navigate = useNavigate();
    const store = useStore();
    const isLastStep = store.stepIndex === routes.length - 1;

    const start = useCallback(() => {
      useStore.getState().reset();
      navigate({ to: routes[0] });
    }, [navigate]);

    const next = useCallback(() => {
      const { stepIndex, state } = useStore.getState();
      if (isLastStep) {
        onFinish?.(state);
        useStore.getState().reset();
        navigate({ to: onFinishRoute });
      } else {
        useStore.getState().advance();
        navigate({ to: routes[stepIndex + 1] });
      }
    }, [navigate]);

    const back = useCallback(() => {
      const { stepIndex } = useStore.getState();
      if (stepIndex > 0) {
        useStore.getState().goBack();
        navigate({ to: routes[stepIndex - 1] });
      } else {
        useStore.getState().reset();
        navigate({ to: onExit });
      }
    }, [navigate]);

    return {
      state: store.state,
      setState: store.setState,
      isLastStep,
      start,
      next,
      back,
    };
  }

  return { useStore, useWizard };
}
