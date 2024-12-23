import { Window } from "@tauri-apps/api/window"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function TitleBar() {
  const [isPinned, setIsPinned] = useState(false)

  const handlePin = async () => {
    try {
      const newState = !isPinned
      setIsPinned(newState)
      await Window.getCurrent().setAlwaysOnTop(newState)
    } catch (error) {
      console.error('Failed to set always on top:', error)
    }
  }

  const handleMinimize = async () => {
    try {
      await Window.getCurrent().minimize()
    } catch (error) {
      console.error('Failed to minimize window:', error)
    }
  }

  return (
    <div data-tauri-drag-region className="h-8 flex items-center justify-between px-3 bg-zinc-950">
      <div className="text-xs font-medium text-zinc-400">GRANARY</div>
      <div className="flex items-center gap-3">
        <button
          onClick={handlePin}
          className={cn(
            "w-5 h-5 flex items-center justify-center rounded-md",
            "transition-all duration-200",
            "hover:bg-zinc-800",
            isPinned ? "text-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <line x1="12" y1="17" x2="12" y2="22" />
            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
          </svg>
        </button>
        <button
          onClick={handleMinimize}
          className={cn(
            "w-5 h-5 flex items-center justify-center rounded-md",
            "text-zinc-500 hover:text-zinc-300",
            "transition-all duration-200",
            "hover:bg-zinc-800"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 