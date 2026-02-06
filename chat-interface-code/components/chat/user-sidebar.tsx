"use client"

import { useState, useEffect } from "react"
import { LogOut, Gift, Crown, Settings } from "lucide-react"
import type { User } from "@/app/page"

interface UserSidebarProps {
  user: User
  onlineUsers: number
  onLogout: () => void
  onOpenAdmin: () => void
}

export function UserSidebar({ user, onlineUsers, onLogout, onOpenAdmin }: UserSidebarProps) {
  const [giftTimer, setGiftTimer] = useState(300) // 5 minutes in seconds
  const [coins, setCoins] = useState(user.coins)

  // Gift countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setGiftTimer((prev) => {
        if (prev <= 1) {
          // Reset timer and add coins
          setCoins((c) => c + 50)
          return 300
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const levelProgress = (user.messageCount % 100) / 100 * 100

  return (
    <aside className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Gift Timer */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="bg-secondary rounded-[20px] p-4 text-center pulse-gift">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">هدية قادمة</span>
          </div>
          <div className="text-3xl font-bold text-primary tracking-wider">
            {formatTime(giftTimer)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">+50 عملة</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex flex-col items-center">
          {/* Avatar with Orange Glow Border */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-primary to-primary/50 orange-glow">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.username}
                className="w-full h-full rounded-full bg-background"
              />
            </div>
            {user.isAdmin && (
              <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center orange-glow">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Username */}
          {user.isAdmin ? (
            <span className="admin-name text-lg mb-2">{user.username}</span>
          ) : (
            <h3 className="text-xl font-bold text-foreground mb-2">{user.username}</h3>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {user.badges.map((badge, index) => (
              <span
                key={index}
                className="text-xl bg-secondary rounded-lg w-10 h-10 flex items-center justify-center"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Level Progress */}
          <div className="w-full mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">المستوى {user.level}</span>
              <span className="text-primary font-medium">{Math.round(levelProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 progress-glow"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary rounded-[16px] p-4 text-center">
            <span className="text-2xl mb-1 block">💰</span>
            <span className="text-xl font-bold text-foreground">{coins.toLocaleString()}</span>
            <p className="text-xs text-muted-foreground">عملات</p>
          </div>
          <div className="bg-secondary rounded-[16px] p-4 text-center">
            <span className="text-2xl mb-1 block">💬</span>
            <span className="text-xl font-bold text-foreground">{user.messageCount.toLocaleString()}</span>
            <p className="text-xs text-muted-foreground">رسالة</p>
          </div>
        </div>
      </div>

      {/* Online Users */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">المتصلون</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-foreground font-medium">{onlineUsers}</span>
          </div>
        </div>
      </div>

      {/* Admin Button */}
      {user.isAdmin && (
        <div className="p-4 border-b border-sidebar-border">
          <button
            onClick={onOpenAdmin}
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold py-3 rounded-[16px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] orange-glow"
          >
            <Settings className="w-5 h-5" />
            لوحة التحكم
          </button>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium py-3 rounded-[16px] flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          تسجيل خروج
        </button>
      </div>
    </aside>
  )
}
