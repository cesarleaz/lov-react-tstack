import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from 'react-i18next'
import useConfigsStore from '@/stores/configs'
import { PROVIDER_NAME_MAPPING } from '@/constants'
import { ScrollArea } from '@/components/ui/scroll-area'

const ModelSelectorV3 = ({
  onModelToggle,
  onAutoToggle
}) => {
  const textModel = useConfigsStore((state) => state.textModel)
  const setTextModel = useConfigsStore((state) => state.setTextModel)
  const textModels = useConfigsStore((state) => state.textModels)
  const selectedTools = useConfigsStore((state) => state.selectedTools)
  const setSelectedTools = useConfigsStore((state) => state.setSelectedTools)
  const allTools = useConfigsStore((state) => state.allTools)

  const [activeTab, setActiveTab] = useState('image')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { t } = useTranslation()

  const initialAutoMode = allTools.length > 0 && selectedTools.length === allTools.length
  const [autoMode, setAutoMode] = useState(initialAutoMode)

  const groupModelsByProvider = (models) => {
    const grouped = {}
    models?.forEach((model) => {
      if (!grouped[model.provider]) {
        grouped[model.provider] = []
      }
      grouped[model.provider].push(model)
    })
    return grouped
  }

  const groupLLMsByProvider = (models) => {
    const grouped = {}
    models?.forEach((model) => {
      if (!grouped[model.provider]) {
        grouped[model.provider] = []
      }
      grouped[model.provider].push(model)
    })
    return grouped
  }

  const sortProviders = (grouped) => {
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
      if (a === 'jaaz') return -1
      if (b === 'jaaz') return 1
      return a.localeCompare(b)
    })
    return Object.fromEntries(sortedEntries)
  }

  const groupedLLMs = sortProviders(groupLLMsByProvider(textModels))

  const getToolsByType = (type) => {
    const filteredTools = allTools.filter(tool => tool.type === type)
    return groupModelsByProvider(filteredTools)
  }

  const handleModelToggle = (modelKey, checked) => {
    if (activeTab === 'text') {
      const model = textModels?.find((m) => m.provider + ':' + m.model === modelKey)
      if (model) {
        setTextModel(model)
        localStorage.setItem('text_model', modelKey)
      }
    } else {
      let newSelected = []
      const tool = allTools.find((m) => m.provider + ':' + m.id === modelKey)

      if (checked) {
        if (tool) {
          newSelected = [...selectedTools, tool]
        }
      } else {
        newSelected = selectedTools.filter(
          (t) => t.provider + ':' + t.id !== modelKey
        )
      }

      setSelectedTools(newSelected)
      localStorage.setItem(
        'disabled_tool_ids',
        JSON.stringify(
          allTools.filter((t) => !newSelected.includes(t)).map((t) => t.id)
        )
      )

      const isAuto = newSelected.length === allTools.length
      setAutoMode(isAuto)
    }
    onModelToggle?.(modelKey, checked)
  }

  const handleModelClick = (modelKey) => {
    if (activeTab === 'text') {
      const model = textModels?.find((m) => m.provider + ':' + m.model === modelKey)
      if (model) {
        setTextModel(model)
        localStorage.setItem('text_model', modelKey)
        onModelToggle?.(modelKey, true)
      }
    } else {
      if (autoMode) {
        setAutoMode(false)
        const tool = allTools.find((m) => m.provider + ':' + m.id === modelKey)
        if (tool) {
          setSelectedTools([tool])
          localStorage.setItem(
            'disabled_tool_ids',
            JSON.stringify(
              allTools.filter((t) => t.id !== tool.id).map((t) => t.id)
            )
          )
          onModelToggle?.(modelKey, true)
        }
      } else {
        const isSelected = selectedTools.some(t => t.provider + ':' + t.id === modelKey)
        handleModelToggle(modelKey, !isSelected)
      }
    }
  }

  const handleAutoToggle = (enabled) => {
    if (activeTab === 'text') {
      return
    }

    if (enabled) {
      setSelectedTools(allTools)
      localStorage.setItem('disabled_tool_ids', JSON.stringify([]))
    } else {
      const imageTools = allTools.filter(tool => tool.type === 'image')
      const videoTools = allTools.filter(tool => tool.type === 'video')

      const firstImageTool = imageTools.length > 0 ? imageTools[0] : null
      const firstVideoTool = videoTools.length > 0 ? videoTools[0] : null

      const selectedToolsList = []
      if (firstImageTool) selectedToolsList.push(firstImageTool)
      if (firstVideoTool) selectedToolsList.push(firstVideoTool)

      if (selectedToolsList.length > 0) {
        setSelectedTools(selectedToolsList)
        localStorage.setItem(
          'disabled_tool_ids',
          JSON.stringify(
            allTools.filter((t) => !selectedToolsList.includes(t)).map((t) => t.id)
          )
        )
      }
    }
    setAutoMode(enabled)
    onAutoToggle?.(enabled)
  }

  const getCurrentModels = () => {
    if (activeTab === 'text') {
      return groupedLLMs
    } else {
      return getToolsByType(activeTab)
    }
  }

  const isModelSelected = (modelKey) => {
    if (activeTab === 'text') {
      return textModel?.provider + ':' + textModel?.model === modelKey
    } else {
      return selectedTools.some(t => t.provider + ':' + t.id === modelKey)
    }
  }

  const getProviderDisplayInfo = (provider) => {
    const providerInfo = PROVIDER_NAME_MAPPING[provider]
    return {
      name: providerInfo?.name || provider,
      icon: providerInfo?.icon,
    }
  }

  const tabs = [
    { id: 'image', label: t('chat:modelSelector.tabs.image') },
    { id: 'video', label: t('chat:modelSelector.tabs.video') },
    { id: 'text', label: t('chat:modelSelector.tabs.text') }
  ]

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size={'sm'}
          variant="outline"
          className={`w-fit max-w-[40%] justify-between overflow-hidden ${autoMode
            ? 'bg-background border-border text-muted-foreground'
            : 'text-primary border-green-200 bg-green-50'
            }`}
        >
          {autoMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 7l6 0" /><path d="M17 4l0 6" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-apps"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3h-4a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2z" /><path d="M9 13h-4a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2z" /><path d="M19 13h-4a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2z" /><path d="M17 3a1 1 0 0 1 .993 .883l.007 .117v2h2a1 1 0 0 1 .117 1.993l-.117 .007h-2v2a1 1 0 0 1 -1.993 .117l-.007 -.117v-2h-2a1 1 0 0 1 -.117 -1.993l.117 -.007h2v-2a1 1 0 0 1 1 -1z" /></svg>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 select-none">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div>{t('chat:modelSelector.title')}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('chat:modelSelector.auto')}</span>
            <Switch
              checked={autoMode}
              onCheckedChange={handleAutoToggle}
            />
          </div>
        </div>

        <div className="flex p-1 bg-muted rounded-lg mx-4 my-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ScrollArea>
          <div className="max-h-80 h-80 px-4 pb-4 select-none">
            {Object.entries(getCurrentModels()).map(([provider, providerModels], index, array) => {
              const providerInfo = getProviderDisplayInfo(provider)
              const isLastGroup = index === array.length - 1
              return (
                <DropdownMenuGroup key={provider}>
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-0 py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={providerInfo.icon}
                        alt={providerInfo.name}
                        className="w-4 h-4 rounded-full"
                      />
                      {providerInfo.name}
                    </div>
                  </DropdownMenuLabel>
                  {providerModels.map((model) => {
                    const modelKey = activeTab === 'text'
                      ? model.provider + ':' + model.model
                      : model.provider + ':' + model.id
                    const modelName = activeTab === 'text'
                      ? model.model
                      : model.display_name || model.id

                    return (
                      <div
                        key={modelKey}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors mb-2 cursor-pointer"
                        onClick={() => handleModelClick(modelKey)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{modelName}</div>
                        </div>
                        <Checkbox
                          checked={isModelSelected(modelKey)}
                          className={`ml-4 ${autoMode && activeTab !== 'text' ? 'opacity-50' : ''}`}
                          disabled={autoMode && activeTab !== 'text'}
                        />
                      </div>
                    )
                  })}
                  {!isLastGroup && <DropdownMenuSeparator className="my-2" />}
                </DropdownMenuGroup>
              )
            })}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelectorV3
