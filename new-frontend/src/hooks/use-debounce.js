import { useCallback, useRef } from 'react'

export default function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef(undefined)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}
