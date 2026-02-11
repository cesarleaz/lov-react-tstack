import { ToolType } from '@excalidraw/excalidraw/types'
import {
  ArrowUpRight,
  Circle,
  Hand,
  Image,
  Link,
  Minus,
  MousePointer2,
  Pencil,
  Square,
  Type,
} from 'lucide-react'

export type ToolType = Extract<
  ExcalidrawToolType,
  | 'hand'
  | 'selection'
  | 'rectangle'
  | 'ellipse'
  | 'arrow'
  | 'line'
  | 'freedraw'
  | 'text'
  | 'image'
  | 'embeddable'
  | 'lock'
>

const icons: Record<ToolType, React.ComponentType<{ className?: string }>> = {
  hand: Hand,
  selection
  rectangle: Square,
  ellipse
  arrow: ArrowUpRight,
  line
  freedraw: Pencil,
  text
  image: Image,
  embeddable
}

export const toolShortcuts = {
  hand: 'H',
  selection: 'V',
  rectangle: 'R',
  ellipse: 'O',
  arrow: 'A',
  line: 'L',
  freedraw: 'P',
  text: 'T',
  image: '9',
  embeddable: '',
}

export default icons
