import { create } from 'zustand'
import { listModels } from '../api/model'

const useConfigsStore = create((set, get) => ({
  initCanvas: false,
  setInitCanvas: (initCanvas) => set({ initCanvas }),

  textModels: [],
  setTextModels: (models) => set({ textModels: models }),

  selectedTools: [],
  setSelectedTools: (tools) => set({ selectedTools: tools }),

  textModel: undefined,
  setTextModel: (model) => set({ textModel: model }),

  showInstallDialog: false,
  setShowInstallDialog: (show) => set({ showInstallDialog: show }),

  showUpdateDialog: false,
  setShowUpdateDialog: (show) => set({ showUpdateDialog: show }),

  showSettingsDialog: false,
  setShowSettingsDialog: (show) => set({ showSettingsDialog: show }),

  showLoginDialog: false,
  setShowLoginDialog: (show) => set({ showLoginDialog: show }),

  allTools: [],
  setAllTools: (tools) => set({ allTools: tools }),

  providers: {},
  setProviders: (providers) => set({ providers }),

  refreshModels: async () => {
    try {
      const modelList = await listModels()
      if (!modelList) return
      const { llm: llmModels = [], tools: toolList = [] } = modelList

      set({
        textModels: llmModels || [],
        allTools: toolList || []
      })

      // 设置选择的文本模型
      const savedTextModel = localStorage.getItem('text_model')
      if (
        savedTextModel &&
        llmModels.find((m) => m.provider + ':' + m.model === savedTextModel)
      ) {
        set({
          textModel: llmModels.find((m) => m.provider + ':' + m.model === savedTextModel)
        })
      } else {
        set({
          textModel: llmModels.find((m) => m.type === 'text')
        })
      }

      // 设置选中的工具模型
      const disabledToolsJson = localStorage.getItem('disabled_tool_ids')
      let currentSelectedTools = toolList
      if (disabledToolsJson) {
        try {
          const disabledToolIds = JSON.parse(disabledToolsJson)
          currentSelectedTools = toolList.filter(
            (t) => !disabledToolIds.includes(t.id)
          )
        } catch (error) {
          console.error(error)
        }
      }

      set({ selectedTools: currentSelectedTools })

      // 如果文本模型或工具模型为空，则显示登录对话框
      if (llmModels.length === 0 || toolList.length === 0) {
        set({ showLoginDialog: true })
      }
    } catch (error) {
      console.error('Failed to refresh models:', error)
    }
  }
}))

export default useConfigsStore
