import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';

export const taskKeys = {
  all: ['tasks'],
  list: (params) => ['tasks', 'list', params],
  weeks: ['tasks', 'weeks'],
};

export function useTasks(params, options = {}) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksApi.list(params),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useWeeks() {
  return useQuery({ queryKey: taskKeys.weeks, queryFn: tasksApi.weeks });
}

// Every write invalidates all task queries: lists, search results and weekly cards stay in sync.
function useTaskMutation(mutationFn, extra = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    ...extra,
    onSettled: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export const useCreateTask = () => useTaskMutation(tasksApi.create);

export const useUpdateTask = () => useTaskMutation(({ id, ...body }) => tasksApi.update(id, body));

export const useDeleteTask = () => useTaskMutation(tasksApi.remove);

// Optimistic toggle so the checkbox feels instant.
export function useToggleStatus() {
  const qc = useQueryClient();
  return useTaskMutation(({ id, status }) => tasksApi.setStatus(id, status), {
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const snapshot = qc.getQueriesData({ queryKey: ['tasks', 'list'] });
      qc.setQueriesData({ queryKey: ['tasks', 'list'] }, (old) =>
        old ? { ...old, items: old.items.map((t) => (t.id === id ? { ...t, status } : t)) } : old,
      );
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data)),
  });
}
