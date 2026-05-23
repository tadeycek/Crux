import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { ApiSession, ApiSessionDetail } from './api'

export function useSession(problemId: number | null) {
  const qc = useQueryClient()

  const { data: session, isLoading } = useQuery<ApiSession>({
    queryKey: ['session', problemId],
    queryFn: () => api.sessions.create(problemId!),
    enabled: !!problemId,
    staleTime: Infinity,
  })

  const { data: sessionDetail } = useQuery<ApiSessionDetail>({
    queryKey: ['session-detail', session?.id],
    queryFn: () => api.sessions.get(session!.id),
    enabled: !!session?.id,
    staleTime: Infinity,
  })

  const saveCodeMutation = useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) => api.sessions.saveCode(id, code),
  })

  const saveCodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const saveCode = useCallback((code: string) => {
    if (!session?.id) return
    if (saveCodeTimer.current) clearTimeout(saveCodeTimer.current)
    saveCodeTimer.current = setTimeout(() => {
      saveCodeMutation.mutate({ id: session.id, code })
    }, 1500)
  }, [session?.id, saveCodeMutation])

  useEffect(() => () => {
    if (saveCodeTimer.current) clearTimeout(saveCodeTimer.current)
  }, [])

  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['session-detail', session?.id] })
  }, [qc, session?.id])

  return {
    session,
    sessionDetail,
    isLoading,
    saveCode,
    invalidate,
    isSaving: saveCodeMutation.isPending,
  }
}
