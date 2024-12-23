import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

interface SettingsProps {
  duration: number
  onDurationChange: (duration: number) => void
  autoStart: boolean
  onAutoStartChange: (autoStart: boolean) => void
}

const TIME_UNITS = ["minutes", "hours"] as const
type SimpleTimeUnit = typeof TIME_UNITS[number]

export function Settings({ duration, onDurationChange, autoStart, onAutoStartChange }: SettingsProps) {
  const [timeUnit, setTimeUnit] = useState<SimpleTimeUnit>("minutes")
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollInfo, setScrollInfo] = useState({ top: 0, height: 0 })
  const scrollTimeout = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(() => {
    // 根据当前duration计算初始值
    const seconds = duration / 1000
    return { amount: seconds / 60, unit: "minutes" }
  })

  const handleValueChange = (newAmount: number) => {
    setValue(prev => ({ ...prev, amount: newAmount }))
    let milliseconds = newAmount
    switch (timeUnit) {
      case "hours":
        milliseconds *= 3600 * 1000
        break
      case "minutes":
        milliseconds *= 60 * 1000
        break
    }
    onDurationChange(milliseconds)
  }

  const handleUnitChange = (newUnit: SimpleTimeUnit) => {
    let newAmount = value.amount
    // 转换数值以保持总时长不变
    if (timeUnit === "hours" && newUnit === "minutes") newAmount *= 60
    if (timeUnit === "minutes" && newUnit === "hours") newAmount /= 60

    setTimeUnit(newUnit)
    setValue({ amount: newAmount, unit: newUnit })
  }

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
  }, [])

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className={cn(
            "absolute inset-0 space-y-6 overflow-y-auto py-2",
            "custom-scrollbar"
          )}
        >
          <div className="max-w-[400px] mx-auto px-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Timer Duration</div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleValueChange(Math.max(1, value.amount - 1))}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center",
                        "rounded-l-md border border-r-0 border-zinc-700/50",
                        "bg-zinc-800/50 text-zinc-400",
                        "hover:text-zinc-300 hover:bg-zinc-800",
                        "transition-colors"
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      value={value.amount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/\D/g, ''))
                        if (!isNaN(val)) {
                          handleValueChange(val)
                        }
                      }}
                      className={cn(
                        "w-12 h-8 text-sm bg-zinc-800/50",
                        "border-y border-zinc-700/50",
                        "text-zinc-200 placeholder:text-zinc-600",
                        "focus:outline-none focus:ring-0",
                        "transition-colors",
                        "text-center"
                      )}
                    />
                    <button
                      onClick={() => handleValueChange(value.amount + 1)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center",
                        "rounded-r-md border border-l-0 border-zinc-700/50",
                        "bg-zinc-800/50 text-zinc-400",
                        "hover:text-zinc-300 hover:bg-zinc-800",
                        "transition-colors"
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex rounded-md overflow-hidden border border-zinc-800 shrink-0">
                    {TIME_UNITS.map((unit) => (
                      <button
                        key={unit}
                        onClick={() => handleUnitChange(unit)}
                        className={cn(
                          "w-[72px] py-2 text-xs font-medium transition-colors",
                          timeUnit === unit
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                        )}
                      >
                        {unit.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                <div>Set the duration for each relax session</div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-6" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Auto Start</div>
                  <div className="mt-1 text-[10px] text-zinc-600">Start timer automatically when app launches</div>
                </div>
                <button
                  onClick={() => onAutoStartChange(!autoStart)}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-colors flex items-center",
                    "border border-zinc-700/50",
                    autoStart ? "bg-emerald-500/20" : "bg-zinc-800/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full transition-all",
                      "absolute left-0.5",
                      "border border-zinc-700/50",
                      autoStart ? [
                        "translate-x-[18px]",
                        "bg-emerald-400",
                        "border-emerald-500/50"
                      ] : [
                        "translate-x-0",
                        "bg-zinc-600"
                      ]
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-6" />

            <div className="space-y-3">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                About
              </div>
              <div className="text-xs text-zinc-600 leading-relaxed">
                Granary is a simple timer app that helps you manage your work and relax time.
                Take regular breaks to maintain productivity and well-being.
              </div>
            </div>
          </div>
        </div>

        <div 
          className={cn(
            "absolute right-2 top-2 bottom-2 w-1",
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