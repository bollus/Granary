import { useState, useEffect } from "react"
import { RelaxTracker } from "./components/RelaxTracker"
import { Record } from "./components/Record"
import { Settings } from "./components/Settings"
import { Tabs } from "./components/ui/tabs"
import { TitleBar } from "./components/TitleBar"
import { RelaxRecord } from "./types"
import { AutoStart } from "./lib/autostart"

const tabs = [
  { id: "go", label: "GO" },
  { id: "record", label: "RECORD" },
  { id: "settings", label: "SETTINGS" }
]

function App() {
  const [activeTab, setActiveTab] = useState("go")
  const [records, setRecords] = useState<RelaxRecord[]>([])
  const [duration, setDuration] = useState(60 * 60 * 1000) // 默认1小时
  const [autoStart, setAutoStart] = useState(false)

  useEffect(() => {
    // 初始化时检查自启动状态
    AutoStart.isEnabled().then(setAutoStart)
  }, [])

  useEffect(() => {
    const preventDefault = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', preventDefault)
    return () => document.removeEventListener('contextmenu', preventDefault)
  }, [])

  const handleRelax = (record: RelaxRecord) => {
    setRecords(prev => [record, ...prev])
  }

  const handleAutoStartChange = async (enabled: boolean) => {
    const success = enabled 
      ? await AutoStart.enable()
      : await AutoStart.disable()
    
    if (success) {
      setAutoStart(enabled)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      <TitleBar />
      <div className="pt-2 px-4">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className={activeTab === "go" ? "block items-center justify-center" : "hidden"}>
          <RelaxTracker 
            duration={duration}
            onRelax={handleRelax} 
          />
        </div>
        <div className={activeTab === "record" ? "block w-full" : "hidden"}>
          <Record records={records} />
        </div>
        <div className={activeTab === "settings" ? "block w-full" : "hidden"}>
          <Settings 
            duration={duration}
            onDurationChange={setDuration}
            autoStart={autoStart}
            onAutoStartChange={handleAutoStartChange}
          />
        </div>
      </div>
    </div>
  )
}

export default App
