import { useState, useEffect } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, session, loading }
}

export async function signUp(email: string, password: string, username: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  if (error) throw error
}

// Resolves a username to its email via the backend, so we can sign in with Supabase.
async function resolveEmail(usernameOrEmail: string): Promise<string> {
  if (usernameOrEmail.includes('@')) return usernameOrEmail
  const res = await fetch(`${BASE}/api/auth/lookup?username=${encodeURIComponent(usernameOrEmail)}`)
  if (!res.ok) throw new Error('No account found for that username')
  const data = await res.json() as { email: string }
  return data.email
}

export async function signIn(usernameOrEmail: string, password: string) {
  const email = await resolveEmail(usernameOrEmail)
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export async function updateUsername(newUsername: string, token: string) {
  const res = await fetch(`${BASE}/api/auth/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ username: newUsername }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'Failed to update username')
  }
}

export async function fetchProfile(token: string): Promise<{ id: string; username: string | null }> {
  const res = await fetch(`${BASE}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load profile')
  return res.json()
}
