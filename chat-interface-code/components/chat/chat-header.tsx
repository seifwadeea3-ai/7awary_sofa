"use client"

import { MessageCircle, Users } from "lucide-react"

interface ChatHeaderProps {
  onlineUsers: number
  onMenuClick: () => void
  sidebarOpen: boolean
}

export function ChatHeader({ onlineUsers }: ChatHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-primary/10 border border-primary/30 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">7awary Sofa</h1>
              <p className="text-sm text-muted-foreground">الدردشة العامة</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-secondary rounded-[20px] px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground font-medium">{onlineUsers}</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">متصل</span>
        </div>
      </div>
    </header>
  )
}
