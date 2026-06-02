import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'

type ProgressStatus = 'completed' | 'in-progress'

export function useConceptProgress() {
  const queryClient = useQueryClient()

  const { data: progress = {} } = useQuery<Record<string, ProgressStatus>>({
    queryKey: ['concept-progress'],
    queryFn: () => api.concepts.getProgress(),
    staleTime: 60_000,
  })

  const setMutation = useMutation({
    mutationFn: ({ slug, status }: { slug: string; status: ProgressStatus }) =>
      api.concepts.setProgress(slug, status),
    onMutate: async ({ slug, status }) => {
      await queryClient.cancelQueries({ queryKey: ['concept-progress'] })
      const prev = queryClient.getQueryData<Record<string, ProgressStatus>>(['concept-progress'])
      queryClient.setQueryData(['concept-progress'], (old: Record<string, ProgressStatus> = {}) => ({
        ...old,
        [slug]: status,
      }))
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(['concept-progress'], ctx.prev)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['concept-progress'] }),
  })

  function markComplete(slug: string) {
    setMutation.mutate({ slug, status: 'completed' })
  }

  function markInProgress(slug: string) {
    setMutation.mutate({ slug, status: 'in-progress' })
  }

  function getStatus(slug: string): ProgressStatus | null {
    return progress[slug] ?? null
  }

  return { progress, markComplete, markInProgress, getStatus }
}
