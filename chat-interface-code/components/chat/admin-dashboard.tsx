"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { getRankColor, RANKS } from "@/lib/types"
import {
  Settings,
  Shield,
  Ban,
  Coins,
  VolumeX,
  Volume2,
  Megaphone,
  Users,
  ArrowRight,
  Search,
  AlertTriangle,
  MessageCircle,
} from "lucide-react"

export function AdminDashboard() {
  const {
    currentUser,
    users,
    setCurrentView,
    globalMute,
    setGlobalMute,
    broadcastMessage,
    resetUserCoins,
    banUserIP,
    setSelectedUserId,
  } = useApp()

  const [searchQuery, setSearchQuery] = useState("")
  const [broadcastText, setBroadcastText] = useState("")
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [actionLog, setActionLog] = useState<string[]>([])

  if (!currentUser?.isAdmin) return null

  const filteredUsers = users.filter(
    (u) =>
      !u.isAdmin &&
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const logAction = (action: string) => {
    const timestamp = new Date().toLocaleTimeString("ar-EG")
    setActionLog((prev) => [`[${timestamp}] ${action}`, ...prev.slice(0, 9)])
  }

  const handleBan = (userId: string, username: string) => {
    if (window.confirm(`هل أنت متأكد من حظر ${username} نهائياً؟`)) {
      banUserIP(userId)
      logAction(`تم حظر ${username} بشكل دائم`)
    }
  }

  const handleResetCoins = (userId: string, username: string) => {
    if (window.confirm(`هل أنت متأكد من مسح عملات ${username}؟`)) {
      resetUserCoins(userId)
      logAction(`تم مسح عملات ${username}`)
    }
  }

  const handleBroadcast = () => {
    if (broadcastText.trim()) {
      broadcastMessage(broadcastText.trim())
      logAction(`تم إرسال إعلان: "${broadcastText.slice(0, 30)}..."`)
      setBroadcastText("")
      setShowBroadcastModal(false)
    }
  }

  const handleToggleGlobalMute = () => {
    setGlobalMute(!globalMute)
    logAction(globalMute ? "تم فتح الدردشة العامة" : "تم إغلاق الدردشة العامة")
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView("chat")}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground text-lg">لوحة التحكم</h2>
            <p className="text-xs text-muted-foreground">God Mode - Admin Only</p>
          </div>
          <div className="admin-name px-3 py-1 text-sm">{currentUser.username}</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={handleToggleGlobalMute}
              className={`p-4 rounded-[20px] text-center transition-all ${
                globalMute
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-card border border-border hover:border-primary"
              }`}
            >
              {globalMute ? (
                <VolumeX className="w-8 h-8 mx-auto mb-2" />
              ) : (
                <Volume2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
              )}
              <span className="text-sm font-medium block">
                {globalMute ? "الدردشة مغلقة" : "الدردشة مفتوحة"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="bg-card border border-border hover:border-primary p-4 rounded-[20px] text-center transition-all"
            >
              <Megaphone className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium text-foreground block">
                إعلان عام
              </span>
            </button>

            <div className="bg-card border border-border p-4 rounded-[20px] text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <span className="text-2xl font-bold text-foreground block">
                {users.length}
              </span>
              <span className="text-xs text-muted-foreground">مستخدم</span>
            </div>

            <div className="bg-card border border-border p-4 rounded-[20px] text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <span className="text-2xl font-bold text-foreground block">
                {currentUser.coins.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">عملاتك</span>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-card rounded-[24px] p-6 border border-border">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              إدارة المستخدمين
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مستخدم..."
                className="w-full bg-input rounded-[14px] pr-12 pl-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Users List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا يوجد مستخدمين
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-[16px]"
                  >
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium truncate"
                          style={{ color: getRankColor(user.rank) }}
                        >
                          {user.username}
                        </span>
                        {user.isGuest && (
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            زائر
                          </span>
                        )}
                        {user.rank !== "none" && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${getRankColor(user.rank)}20`,
                              color: getRankColor(user.rank),
                            }}
                          >
                            {RANKS[user.rank].name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {user.coins.toLocaleString()} عملة
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserId(user.id)
                          setCurrentView("profile")
                        }}
                        className="p-2 bg-primary/10 text-primary rounded-[10px] hover:bg-primary/20 transition-colors"
                        title="عرض الملف"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetCoins(user.id, user.username)}
                        className="p-2 bg-yellow-500/10 text-yellow-500 rounded-[10px] hover:bg-yellow-500/20 transition-colors"
                        title="مسح العملات"
                      >
                        <Coins className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBan(user.id, user.username)}
                        className="p-2 bg-destructive/10 text-destructive rounded-[10px] hover:bg-destructive/20 transition-colors"
                        title="حظر نهائي"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Log */}
          <div className="bg-card rounded-[24px] p-6 border border-border">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              سجل العمليات
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {actionLog.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  لا يوجد عمليات
                </p>
              ) : (
                actionLog.map((log, index) => (
                  <div
                    key={index}
                    className="text-sm text-muted-foreground bg-secondary p-2 rounded-[10px] font-mono"
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[24px] p-6 w-full max-w-md">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              إرسال إعلان عام
            </h3>
            <textarea
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full bg-input rounded-[14px] p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32 mb-4"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBroadcast}
                disabled={!broadcastText.trim()}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-[14px] font-bold disabled:opacity-50"
              >
                إرسال للجميع
              </button>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="flex-1 bg-secondary text-foreground py-3 rounded-[14px] font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
