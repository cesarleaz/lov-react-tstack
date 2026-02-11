import { useEffect, useRef, useState, useCallback } from 'react'
import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  BoldItalicUnderlineToggles,
  UndoRedo,
  toolbarPlugin,
  InsertTable,
  InsertImage,
  Separator,
  CodeToggle,
  ListsToggle,
  CreateLink,
  BlockTypeSelect,
  linkPlugin,
  imagePlugin,
} from '@mdxeditor/editor'

import { toast } from 'sonner'
import { useTheme } from '@/hooks/use-theme'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { ImagePlusIcon, SaveIcon } from 'lucide-react'
import { Button } from '../ui/button'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { uploadImage } from '@/api/upload'
const mdParser = new MarkdownIt()

(toolbar).style.padding = '0px'
    }

    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        // Ensure that there's a non-empty selection
        if (!range.collapsed) {
          const rect = range.getBoundingClientRect()
          setSelectionPosition({ top: rect.top - 50, left: rect.left })
          setIsTextSelected(true)
        } else {
          setIsTextSelected(false) // No selection or collapsed selection
        }
      } else {
        setIsTextSelected(false) // No selection
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  const handleImageUpload = async (file) => {
    const res = await uploadImage(file)
    console.log('res', res)
    return res.url
  }
  return (
    <div className="mb-5 p-5">
      <div
        className="flex py-2 items-center gap-2 justify-between"
        style={{ height: `${HEADER_HEIGHT}px` }}
      >
        <div className="flex items-center gap-2">
          <Switch checked={isPreviewMode} onCheckedChange={setIsPreviewMode} />
          <span className="text-sm">Preview</span>
        </div>
        <Button className="w-[200px]">
          <SaveIcon />
          Save
        </Button>
      </div>
      <div className="overflow-y-auto">
        <div className="mb-5 border rounded-md overflow-hidden">
          <MdEditor
            value={editorContent}
            style={{ height: '80vh' }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={({ text }) => setEditorContentWrapper(text)}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
    </div>
  )
}

function getTitleAndContent(value) {
  const firstNewlineIndex = value.indexOf('\n')
  if (firstNewlineIndex !== -1 && value.startsWith('# ')) {
    const title = value.substring(2, firstNewlineIndex).trim() // Extract title without '# '
    const content = value.substring(firstNewlineIndex + 1).trim() // Extract content after the first newline
    console.log('content', content)
    return { title, content }
  }
  return { title: '', content: value }
}
