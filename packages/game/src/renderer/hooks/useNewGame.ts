import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { dataPackQueryOptions } from '../stores';

export function useNewGame() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const basePath = await window.electronAPI.getBaseDataPath();
      await queryClient.fetchQuery(dataPackQueryOptions(basePath));
    },
    onSuccess: () => navigate({ to: '/game/map' }),
  });
}
