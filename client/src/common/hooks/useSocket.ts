import { useQuery } from '@tanstack/react-query';
import { ontimeQueryClient as queryClient } from 'common/queryClient';
import { subscribeOnce } from 'common/utils/socket';

function createSocketHook<T>(key: string, defaultValue: T | null = null) {
  subscribeOnce<T>(key, (data) => queryClient.setQueryData([key], data));

  // retrieves data from the cache or null if non-existent
  // we need the null because useQuery can't receive undefined
  const fetcher = () => (queryClient.getQueryData([key]) ?? defaultValue) as T | null;

  return () => useQuery([key], fetcher);
}

const EmptyEventList = {
  selectEventId: null,
  nextEventId: null,
  playback: null,
};

export const useEventList = createSocketHook('event-list', EmptyEventList);

const EmptyTimer = {
  clock: 0,
  running: 0,
  isNegative: false,
  startedAt: null,
  expectedFinish: null,
};

export const useTimer = createSocketHook('timer', EmptyTimer);
