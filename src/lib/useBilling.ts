import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import type { ApiBillingStatus } from './api'

const FREE_STATUS: ApiBillingStatus = {
  subscriptionStatus: 'free',
  isPro: false,
  aiMessagesToday: 0,
  aiMessagesLimit: 10,
  aiMessagesRemaining: 10,
}

export function useBilling() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['billing-status'],
    queryFn: () => api.billing.status(),
    staleTime: 60_000,
  })

  return {
    billing: data ?? FREE_STATUS,
    isLoading,
    refetch,
  }
}
