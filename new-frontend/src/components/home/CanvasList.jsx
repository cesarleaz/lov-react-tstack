import { useEffect, useState, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'

import { listCanvases } from '../api/canvas'
import CanvasCard from './CanvasCard'

const CanvasList = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [canvases, setCanvases] = useState([])
  const isHomePage = location.pathname === '/'

  const fetchCanvases = async () => {
    try {
      const data = await listCanvases()
      setCanvases(data)
    } catch (error) {
      console.error('Failed to fetch canvases:', error)
    }
  }

  useEffect(() => {
    if (isHomePage) {
      fetchCanvases()
    }
  }, [isHomePage])

  const handleCanvasClick = (id) => {
    navigate(`/canvas/${id}`)
  }

  return (
    <div className="flex flex-col px-10 mt-10 gap-4 select-none max-w-[1200px] mx-auto">
      {canvases && canvases.length > 0 && (
        <motion.span
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('home:allProjects')}
        </motion.span>
      )}

      <AnimatePresence>
        <div className="grid grid-cols-4 gap-4 w-full pb-10">
          {canvases?.map((canvas, index) => (
            <CanvasCard
              key={canvas.id}
              index={index}
              canvas={canvas}
              handleCanvasClick={handleCanvasClick}
              handleDeleteCanvas={() => fetchCanvases()}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}

export default memo(CanvasList)
