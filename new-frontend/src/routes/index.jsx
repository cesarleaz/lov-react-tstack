import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'

import { createCanvas } from '../api/canvas'
import ChatTextarea from '../components/chat/ChatTextarea'
import CanvasList from '../components/home/CanvasList'
import { ScrollArea } from '../components/ui/scroll-area'
import useConfigsStore from '../stores/configs'
import { DEFAULT_SYSTEM_PROMPT } from '../constants'
import TopMenu from '../components/TopMenu'

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const setInitCanvas = useConfigsStore((state) => state.setInitCanvas)
  const [isPending, setIsPending] = useState(false)

  const handleSendMessages = async (messages, configs) => {
    try {
      setIsPending(true)
      const variables = {
        name: t('home:newCanvas'),
        canvas_id: nanoid(),
        messages: messages,
        session_id: nanoid(),
        text_model: configs.textModel,
        tool_list: configs.toolList,
        system_prompt: localStorage.getItem('system_prompt') || DEFAULT_SYSTEM_PROMPT,
      }
      const data = await createCanvas(variables)
      setInitCanvas(true)
      navigate(`/canvas/${data.id}?sessionId=${variables.session_id}`)
    } catch (error) {
      toast.error(t('common:messages.error'), {
        description: error.message,
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className='flex flex-col h-screen'>
      <ScrollArea className='h-full'>
        <TopMenu />

        <div className='relative flex flex-col items-center justify-center h-fit min-h-[calc(100vh-460px)] pt-[60px] select-none'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className='text-5xl font-bold mb-2 mt-8 text-center'>{t('home:title')}</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className='text-xl text-gray-500 mb-8 text-center'>{t('home:subtitle')}</p>
          </motion.div>

          <ChatTextarea
            className='w-full max-w-xl'
            messages={[]}
            onSendMessages={handleSendMessages}
            pending={isPending}
          />
        </div>

        <CanvasList />
      </ScrollArea>
    </div>
  )
}

export default Home
