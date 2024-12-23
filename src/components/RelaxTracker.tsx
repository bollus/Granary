import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { RelaxRecord } from "@/types"

interface RelaxTrackerProps {
  duration: number
  onRelax: (record: RelaxRecord) => void
}

export function RelaxTracker({ duration, onRelax }: RelaxTrackerProps) {
  const [started, setStarted] = useState(false)
  const [balance, setBalance] = useState(1)
  const [nextIncrementTime, setNextIncrementTime] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')
  const [relaxCount, setRelaxCount] = useState(0)

  const resetTimer = () => {
    const now = Date.now()
    setNextIncrementTime(now + duration)
    setProgress(0)
    updateTimeDisplay(duration)
  }

  const updateTimeDisplay = (remainingTime: number) => {
    const seconds = Math.ceil(remainingTime / 1000)
    setTimeLeft(`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`)
  }

  useEffect(() => {
    if (!started) return
    resetTimer()
    return () => {}
  }, [started])

  useEffect(() => {
    if (!nextIncrementTime || !started) return

    const timer = setInterval(() => {
      const now = Date.now()
      const remainingTime = Math.max(0, nextIncrementTime - now)
      
      if (remainingTime <= 0) {
        setBalance(prev => prev + 1)
        resetTimer()
        return
      }

      const elapsed = duration - remainingTime
      const currentProgress = (elapsed / duration) * 100
      setProgress(currentProgress)
      updateTimeDisplay(remainingTime)
    }, 50)

    return () => clearInterval(timer)
  }, [nextIncrementTime, started])

  const handleRelax = () => {
    if (balance > 0) {
      setBalance(prev => prev - 1)
      resetTimer()
      const newCount = relaxCount + 1
      setRelaxCount(newCount)
      
      const record: RelaxRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        count: newCount
      }
      onRelax(record)
    }
  }

  const handleStop = () => {
    setStarted(false)
    setBalance(1)
    setProgress(0)
    setTimeLeft('')
  }

  return (
    <div className={cn(
        "flex flex-col items-center", started ? "gap-0" : "gap-4"
    )}>
      <div className="relative w-32 h-32">
        <button
          onClick={started ? handleRelax : () => setStarted(true)}
          disabled={started && balance <= 0}
          className={cn(
            "absolute inset-0 w-full h-full rounded-full",
            "transition-all duration-300 active:scale-105 ease-in-out",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
            started ? [
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]",
              "active:shadow-[0_0_5px_rgba(52,211,153,0.3)]",
              "group"
            ] : [
              "bg-zinc-800 text-zinc-400",
              "hover:text-emerald-400/80 hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]",
            ]
          )}
        >
          <div className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            started ? "opacity-0 scale-90" : "opacity-100 scale-100"
          )}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-lg font-medium tracking-wider">START</div>
            </div>
          </div>

          <div className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            started ? "opacity-100 scale-100" : "opacity-0 scale-110"
          )}>
            <svg className="w-full h-full -rotate-90">
              <circle
                className="text-zinc-700"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-emerald-400 transition-all ease-in-out"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <div className="text-3xl font-bold text-white/90 transition-opacity group-hover:text-white">
                {balance}
              </div>
              <div 
                className={cn(
                  "text-sm font-medium transition-opacity",
                  balance > 0 ? "text-emerald-400/80" : "text-zinc-400/80"
                )}
              >
                {balance > 0 ? "RELAX" : "DON'T DO IT"}
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className={cn(
        "flex flex-col items-center transition-all duration-500 ease-in-out mt-6",
        started ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 h-0"
      )}>
        <div className="text-2xl font-mono text-white/80">
          {timeLeft}
        </div>
        <div className="relative w-full flex flex-col items-center">
          <div className="text-xs text-zinc-500 uppercase tracking-wider">
            {balance > 0 ? "Let's be fun" : "No more, You can go work"}
          </div>
          <div className="relative mt-6 w-full flex justify-center">
            <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            <button
              onClick={handleStop}
              className={cn(
                "text-xs text-zinc-500 hover:text-zinc-300",
                "transition-all duration-300",
                "uppercase tracking-widest",
                "px-4 py-1 rounded-full",
                "border border-zinc-800 hover:border-zinc-700",
                "hover:shadow-[0_0_10px_rgba(39,39,42,0.2)]",
                "bg-zinc-900/50 backdrop-blur-sm"
              )}
            >
              Stop
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "flex flex-col items-center gap-2 transition-all duration-500 ease-in-out",
        started ? "hidden" : "opacity-100 translate-y-0"
      )}>
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                "bg-zinc-700 transition-colors",
                i === 2 && "w-2 h-2 bg-zinc-600"
              )}
            />
          ))}
        </div>
        <div className="text-xs text-zinc-600">
          {relaxCount > 0 
            ? `You've relaxed ${relaxCount} times today`
            : "Start your first relax of the day"
          }
        </div>
      </div>
    </div>
  )
} 