import { useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
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
  const pendingCodeRef = useRef<string | null>(null)
  // Keep a stable ref to the auth token so beforeunload can read it without async
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      tokenRef.current = data.session?.access_token ?? null
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      tokenRef.current = s?.access_token ?? null
    })
    return () => subscription.unsubscribe()
  }, [])

  const saveCode = useCallback((code: string) => {
    if (!session?.id) return
    pendingCodeRef.current = code
    if (saveCodeTimer.current) clearTimeout(saveCodeTimer.current)
    saveCodeTimer.current = setTimeout(() => {
      saveCodeMutation.mutate({ id: session.id, code })
      pendingCodeRef.current = null
    }, 1500)
  }, [session?.id, saveCodeMutation])

  // Flush any pending debounced save when the tab closes
  useEffect(() => {
    function handleUnload() {
      const code = pendingCodeRef.current
      const id = session?.id
      const token = tokenRef.current
      if (!code || !id || !token) return
      if (saveCodeTimer.current) clearTimeout(saveCodeTimer.current)
      fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api/sessions/${id}/code`,
        {
          method: 'PATCH',
          keepalive: true,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ code }),
        },
      )
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [session?.id])

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
    saveError: saveCodeMutation.isError,
  }
}
