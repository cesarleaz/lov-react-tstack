import { useState, useEffect, useCallback } from 'react'
import { getBalance } from '@/api/billing'
import useAuthStore from '@/stores/auth'

export function useBalance() {
  const authStatus = useAuthStore((state) => state.authStatus)
  const [balance, setBalance] = useState('0.00')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshBalance = useCallback(async () => {
    if (!authStatus.is_logged_in) return

    try {
      setIsLoading(true)
      const data = await getBalance()
      setBalance(data?.balance || '0.00')
      setError(null)
    } catch (err) {
      setError(err)
      console.error('Failed to fetch balance:', err)
    } finally {
      setIsLoading(false)
    }
  }, [authStatus.is_logged_in])

  useEffect(() => {
    if (authStatus.is_logged_in) {
      refreshBalance()
    }
  }, [authStatus.is_logged_in, refreshBalance])

  return {
    balance,
    error,
    isLoading,
    refreshBalance,
  }
}
