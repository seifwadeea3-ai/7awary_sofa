"use client"

import { useApp } from "@/lib/app-context"
import { getRankColor, RANKS } from "@/lib/types"
import {
  LogOut,
  Gift,
  Crown,
  Settings,
  Store,
  MessageCircle,
  Users,
  Bell,
  User,
  Coins,
} from "lucide-react"

interface SidebarProps {
  onClose: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const {
    currentUser,
    logout,
    giftTimeRemaining,
    collectPendingCoins,
    currentView,
    setCurrentView,
    notifications,
    users,
  } = useApp()

  if (!currentUser) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const levelProgress = ((currentUser.messageCount % 100) / 100) * 100
  const unreadNotifications = notifications.filter((n) => !n.read).length
  const onlineUsers = users.length

  const handleCollectCoins = () => {
    const collected = collectPendingCoins()
    if (collected > 0) {
      // Visual feedback would be nice here
    }
  }

  const navItems = [
    { id: "chat", icon: MessageCircle, label: "الدردشة" },
    { id: "groups", icon: Users, label: "الجروبات" },
    { id: "store", icon: Store, label: "المتجر" },
    { id: "notifications", icon: Bell, label: "الإشعارات", badge: unreadNotifications },
    { id: "profile", icon: User, label: "الملف الشخصي" },
  ] as const

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
            {formatTime(giftTimeRemaining)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            +{RANKS[currentUser.rank].hourlyCoins.toLocaleString()} عملة
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div
              className="w-20 h-20 rounded-full p-1 orange-glow"
              style={{
                background: `linear-gradient(135deg, ${getRankColor(currentUser.rank)}, ${getRankColor(currentUser.rank)}80)`,
              }}
            >
              <img
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.username}
                className="w-full h-full rounded-full bg-background"
              />
            </div>
            {currentUser.isAdmin && (
              <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center orange-glow">
                <Crown className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Username */}
          {currentUser.isAdmin ? (
            <span className="admin-name text-base mb-1">{currentUser.username}</span>
          ) : (
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: getRankColor(currentUser.rank) }}
            >
              {currentUser.username}
            </h3>
          )}

          {/* Rank Badge */}
          {currentUser.rank !== "none" && (
            <span
              className="text-xs px-3 py-1 rounded-full mb-3"
              style={{
                backgroundColor: `${getRankColor(currentUser.rank)}20`,
                color: getRankColor(currentUser.rank),
              }}
            >
              {RANKS[currentUser.rank].name}
            </span>
          )}

          {currentUser.isGuest && (
            <span className="text-xs px-3 py-1 rounded-full mb-3 bg-muted text-muted-foreground">
              زائر
            </span>
          )}

          {/* Badges */}
          {currentUser.badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
              {currentUser.badges.slice(0, 4).map((badge) => (
                <span
                  key={badge.id}
                  className="text-lg bg-secondary rounded-lg w-9 h-9 flex items-center justify-center"
                  title={badge.name}
                >
                  {badge.icon}
                </span>
              ))}
              {currentUser.badges.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{currentUser.badges.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Level Progress */}
          <div className="w-full mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">المستوى {currentUser.level}</span>
              <span className="text-primary font-medium">{Math.round(levelProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
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
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCollectCoins}
            className="bg-secondary rounded-[14px] p-3 text-center hover:bg-secondary/80 transition-colors relative group"
          >
            <Coins className="w-5 h-5 text-primary mx-auto mb-1" />
            <span className="text-base font-bold text-foreground block">
              {currentUser.coins.toLocaleString()}
            </span>
            <p className="text-[10px] text-muted-foreground">عملات</p>
            {currentUser.pendingCoins > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                +{currentUser.pendingCoins}
              </span>
            )}
          </button>
          <div className="bg-secondary rounded-[14px] p-3 text-center">
            <MessageCircle className="w-5 h-5 text-primary mx-auto mb-1" />
            <span className="text-base font-bold text-foreground block">
              {currentUser.messageCount.toLocaleString()}
            </span>
            <p className="text-[10px] text-muted-foreground">رسالة</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCurrentView(item.id)
                onClose()
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all ${
                currentView === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge ? (
                <span className="mr-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Online Users */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">المتصلون</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-foreground font-medium">{onlineUsers}</span>
          </div>
        </div>
      </div>

      {/* Admin Button */}
      {currentUser.isAdmin && (
        <div className="p-4 pt-0">
          <button
            type="button"
            onClick={() => {
              setCurrentView("admin")
              onClose()
            }}
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold py-3 rounded-[14px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] orange-glow"
          >
            <Settings className="w-5 h-5" />
            لوحة التحكم
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={logout}
          className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium py-3 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          تسجيل خروج
        </button>
      </div>
    </aside>
  )
}
