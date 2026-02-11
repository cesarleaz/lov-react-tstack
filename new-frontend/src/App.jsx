import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

import UpdateNotificationDialog from './components/common/UpdateNotificationDialog'
import SettingsDialog from './components/settings/dialog'
import { LoginDialog } from './components/auth/LoginDialog'
import { ThemeProvider } from './components/theme/ThemeProvider'
import { useTheme } from './hooks/use-theme'
import { SocketProvider } from './contexts/socket'
import useAuthStore from './stores/auth'
import useConfigsStore from './stores/configs'

import Home from './routes/index'
import Canvas from './routes/canvas.$id'
import Knowledge from './routes/knowledge'
import AgentStudio from './routes/agent_studio'
import Assets from './routes/assets'

import './assets/style/App.css'
import './i18n'

function App() {
  const { theme } = useTheme()
  const refreshAuth = useAuthStore((state) => state.refreshAuth)
  const refreshModels = useConfigsStore((state) => state.refreshModels)

  useEffect(() => {
    refreshAuth()
    refreshModels()
  }, [refreshAuth, refreshModels])

  // Auto-start ComfyUI on app startup
  useEffect(() => {
    const autoStartComfyUI = async () => {
      try {
        const isInstalled = await window.electronAPI?.checkComfyUIInstalled()
        if (!isInstalled) {
          console.log('ComfyUI is not installed, skipping auto-start')
          return
        }

        console.log('Auto-starting ComfyUI...')
        const result = await window.electronAPI?.startComfyUIProcess()

        if (result?.success) {
          console.log('ComfyUI auto-started successfully:', result.message)
        } else {
          console.log('Failed to auto-start ComfyUI:', result?.message)
        }
      } catch (error) {
        console.error('Error during ComfyUI auto-start:', error)
      }
    }

    if (window.electronAPI) {
      autoStartComfyUI()
    }
  }, [])

  return (
    <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
      <SocketProvider>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/canvas/:id" element={<Canvas />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/agent_studio" element={<AgentStudio />} />
              <Route path="/assets" element={<Assets />} />
            </Routes>

            <UpdateNotificationDialog />
            <SettingsDialog />
            <LoginDialog />
          </div>
        </BrowserRouter>
        <Toaster position="bottom-center" richColors />
      </SocketProvider>
    </ThemeProvider>
  )
}

export default App
