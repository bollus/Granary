import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())

  const getTabPosition = (id: string) => {
    const button = tabRefs.current.get(id)
    return button ? `${button.offsetLeft}px` : "0"
  }

  const getTabWidth = (id: string) => {
    const button = tabRefs.current.get(id)
    return button ? `${button.offsetWidth}px` : "0"
  }

  return (
    <div className="relative border-b border-zinc-800">
      <div className="flex w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el)
              else tabRefs.current.delete(tab.id)
            }}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 text-sm font-medium transition-colors py-2",
              activeTab === tab.id
                ? "text-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className={cn(
          "absolute bottom-0 h-0.5 bg-emerald-400/50",
          "transition-all duration-300 ease-out"
        )}
        style={{
          left: getTabPosition(activeTab),
          width: getTabWidth(activeTab)
        }}
      />
    </div>
  )
} 