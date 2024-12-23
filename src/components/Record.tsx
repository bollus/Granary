import { cn } from "@/lib/utils"
import { RelaxRecord } from "@/types"
import { format } from "date-fns"
import { useState, useRef, useEffect } from "react"

interface RecordProps {
  records: RelaxRecord[]
}

export function Record({ records }: RecordProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollInfo, setScrollInfo] = useState({ top: 0, height: 0 })
  const scrollTimeout = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    setIsScrolling(true)
    updateScrollInfo()
    if (scrollTimeout.current) {
      window.clearTimeout(scrollTimeout.current)
    }
    scrollTimeout.current = window.setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
  }

  const updateScrollInfo = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const scrollableHeight = scrollHeight - clientHeight
      const trackHeight = clientHeight - 8
      const heightPercent = (clientHeight / scrollHeight) * 100
      const thumbHeight = (clientHeight * heightPercent) / 100
      const maxScrollTop = trackHeight - thumbHeight
      const scrollPercent = scrollableHeight > 0
        ? (scrollTop / scrollableHeight) * maxScrollTop
        : 0

      setScrollInfo({ 
        top: scrollPercent, 
        height: heightPercent 
      })
    }
  }

  useEffect(() => {
    updateScrollInfo()
  }, [records])

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden">

      <div className="flex-1 relative">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className={cn(
            "absolute inset-0 space-y-2 overflow-y-auto px-4 pb-4",
            "custom-scrollbar"
          )}
        >
          {records.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
              No records yet
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className={cn(
                  "group p-3 rounded-lg",
                  "bg-zinc-800/30 backdrop-blur-sm",
                  "border border-zinc-800/50",
                  "transition-all duration-200",
                  "hover:bg-zinc-800/50",
                  "hover:border-zinc-700/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-zinc-300 font-medium group-hover:text-zinc-200">
                      {format(record.timestamp, "HH:mm")}
                    </div>
                    <div className="text-xs text-zinc-500 group-hover:text-zinc-400">
                      {format(record.timestamp, "yyyy/MM/dd")}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="text-xs text-zinc-500 group-hover:text-zinc-400">
                      RELAX
                    </div>
                    <div className="text-sm font-medium text-emerald-400/90 group-hover:text-emerald-400">
                      #{record.count}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div 
          className={cn(
            "absolute right-1.5 top-2 bottom-2 w-1",
            "transition-opacity duration-300",
            isScrolling ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative h-full">
            <div className="absolute inset-0 rounded-full bg-zinc-800/50" />
            <div 
              className="absolute w-full rounded-full bg-zinc-600/50 transition-all"
              style={{
                transform: `translateY(${scrollInfo.top}px)`,
                height: `${Math.max(scrollInfo.height, 10)}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 