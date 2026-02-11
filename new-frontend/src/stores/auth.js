import { create } from 'zustand'
import { toast } from 'sonner'
import { getAuthStatus } from '../api/auth'

const useAuthStore = create((set) => ({
  authStatus: {
    status: 'logged_out',
    is_logged_in: false,
  },
  isLoading: true,
  refreshAuth: async () => {
    try {
      set({ isLoading: true })
      const status = await getAuthStatus()

      if (status.tokenExpired) {
        toast.error('登录状态已过期，请重新登录', {
          duration: 5000,
        })
      }

      set({ authStatus: status })
    } catch (error) {
      console.error('获取认证状态失败:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useAuthStore
