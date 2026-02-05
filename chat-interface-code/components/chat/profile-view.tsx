"use client"

import { useState, useRef } from "react"
import { useApp } from "@/lib/app-context"
import { getRankColor, RANKS } from "@/lib/types"
import {
  ArrowRight,
  Edit2,
  Star,
  Send,
  UserPlus,
  MessageCircle,
  Crown,
  Camera,
} from "lucide-react"

export function ProfileView() {
  const {
    currentUser,
    users,
    selectedUserId,
    setSelectedUserId,
    setCurrentView,
    transferCoins,
    updateUser,
  } = useApp()

  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(currentUser?.bio || "")
  const [showTransfer, setShowTransfer] = useState(false)
  const [transferAmount, setTransferAmount] = useState("")
  const [error, setError] = useState("")

  // If viewing another user's profile
  const viewingUser = selectedUserId
    ? users.find((u) => u.id === selectedUserId)
    : currentUser

  if (!viewingUser || !currentUser) return null

  const isOwnProfile = viewingUser.id === currentUser.id
  const levelProgress = ((viewingUser.messageCount % 100) / 100) * 100

  const handleSaveBio = () => {
    if (currentUser) {
      updateUser(currentUser.id, { bio })
      setIsEditing(false)
    }
  }

  const handleTransfer = () => {
    setError("")
    const amount = Number.parseInt(transferAmount)
    if (Number.isNaN(amount) || amount <= 0) {
      setError("أدخل مبلغ صحيح")
      return
    }
    const result = transferCoins(viewingUser.id, amount)
    if (!result.success) {
      setError(result.error || "حدث خطأ")
    } else {
      setShowTransfer(false)
      setTransferAmount("")
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedUserId(null)
              setCurrentView("chat")
            }}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-foreground text-lg">
            {isOwnProfile ? "ملفي الشخصي" : `الملف الشخصي - ${viewingUser.username}`}
          </h2>
        </div>
      </header>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Avatar & Basic Info */}
          <div className="bg-card rounded-[24px] p-6 text-center">
            <div className="relative inline-block mb-4">
              <div
                className="w-28 h-28 rounded-full p-1 orange-glow"
                style={{
                  background: `linear-gradient(135deg, ${getRankColor(viewingUser.rank)}, ${getRankColor(viewingUser.rank)}80)`,
                }}
              >
                <img
                  src={viewingUser.avatar || "/placeholder.svg"}
                  alt={viewingUser.username}
                  className="w-full h-full rounded-full bg-background"
                />
              </div>
              {viewingUser.isAdmin && (
                <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center orange-glow">
                  <Crown className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Username */}
            {viewingUser.isAdmin ? (
              <span className="admin-name text-xl mb-2 inline-block">{viewingUser.username}</span>
            ) : (
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: getRankColor(viewingUser.rank) }}
              >
                {viewingUser.username}
              </h3>
            )}

            {/* Rank */}
            {viewingUser.rank !== "none" && (
              <span
                className="inline-block text-sm px-4 py-1.5 rounded-full mb-4"
                style={{
                  backgroundColor: `${getRankColor(viewingUser.rank)}20`,
                  color: getRankColor(viewingUser.rank),
                }}
              >
                {RANKS[viewingUser.rank].name}
              </span>
            )}

            {/* Bio */}
            <div className="mt-4">
              {isOwnProfile && isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="اكتب نبذة عنك..."
                    className="w-full bg-input rounded-[16px] p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                    maxLength={150}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveBio}
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-[12px] font-medium"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setBio(currentUser.bio)
                      }}
                      className="flex-1 bg-secondary text-foreground py-2 rounded-[12px] font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <p className="text-muted-foreground text-sm">
                    {viewingUser.bio || "لا يوجد نبذة"}
                  </p>
                  {isOwnProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="absolute top-0 left-0 text-primary hover:text-primary/80"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Level & Stats */}
          <div className="bg-card rounded-[24px] p-6">
            <h4 className="font-bold text-foreground mb-4">الإحصائيات</h4>

            {/* Level */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  المستوى {viewingUser.level}/10
                </span>
                <span className="text-primary font-medium">
                  {Math.round(levelProgress)}%
                </span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 progress-glow"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-[16px] p-4 text-center">
                <span className="text-2xl font-bold text-foreground block">
                  {viewingUser.coins.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">عملات</p>
              </div>
              <div className="bg-secondary rounded-[16px] p-4 text-center">
                <span className="text-2xl font-bold text-foreground block">
                  {viewingUser.messageCount.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">رسالة</p>
              </div>
            </div>

            {/* Admin Rating */}
            {viewingUser.adminRating > 0 && (
              <div className="mt-4 flex items-center justify-center gap-1">
                <span className="text-sm text-muted-foreground ml-2">تقييم المشرف:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= viewingUser.adminRating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          {viewingUser.badges.length > 0 && (
            <div className="bg-card rounded-[24px] p-6">
              <h4 className="font-bold text-foreground mb-4">الأوسمة</h4>
              <div className="grid grid-cols-4 gap-3">
                {viewingUser.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-secondary rounded-[16px] p-3 text-center"
                    title={badge.name}
                  >
                    <span className="text-2xl block mb-1">{badge.icon}</span>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions for other users */}
          {!isOwnProfile && !currentUser.isGuest && (
            <div className="space-y-3">
              {/* Transfer Coins */}
              {showTransfer ? (
                <div className="bg-card rounded-[24px] p-6">
                  <h4 className="font-bold text-foreground mb-4">إرسال عملات</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    سيتم خصم 15% كرسوم تحويل
                  </p>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="المبلغ..."
                    className="w-full bg-input rounded-[14px] px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                  />
                  {error && (
                    <p className="text-destructive text-sm mb-3">{error}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleTransfer}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-[14px] font-medium"
                    >
                      إرسال
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTransfer(false)
                        setError("")
                      }}
                      className="flex-1 bg-secondary text-foreground py-3 rounded-[14px] font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTransfer(true)}
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-[16px] font-medium flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    إرسال عملات
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-secondary text-foreground py-3 rounded-[16px] font-medium flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    طلب صداقة
                  </button>
                </div>
              )}

              {/* Admin: Private Chat */}
              {currentUser.isAdmin && (
                <button
                  type="button"
                  onClick={() => setCurrentView("private-chat")}
                  className="w-full bg-card border border-primary text-primary py-3 rounded-[16px] font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  رسالة خاصة
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
