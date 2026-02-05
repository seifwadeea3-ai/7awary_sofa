"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { BADGES, RANKS, getRankColor, type UserRank } from "@/lib/types"
import { Store, Crown, Award, Check, Lock, Coins } from "lucide-react"

type StoreTab = "ranks" | "badges"

export function StoreView() {
  const { currentUser, purchaseItem } = useApp()
  const [activeTab, setActiveTab] = useState<StoreTab>("ranks")
  const [purchaseStatus, setPurchaseStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  if (!currentUser) return null

  const handlePurchase = (type: "rank" | "badge", itemId: string) => {
    const result = purchaseItem(type, itemId)
    if (result.success) {
      setPurchaseStatus({ type: "success", message: "تم الشراء بنجاح!" })
    } else {
      setPurchaseStatus({ type: "error", message: result.error || "حدث خطأ" })
    }
    setTimeout(() => setPurchaseStatus(null), 3000)
  }

  const rankOrder: UserRank[] = ["bronze", "silver", "gold"]

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground text-lg">المتجر</h2>
            <p className="text-xs text-muted-foreground">
              اشترِ الرتب والأوسمة بالعملات
            </p>
          </div>
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">
              {currentUser.coins.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("ranks")}
            className={`flex-1 py-3 rounded-[16px] font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "ranks"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crown className="w-5 h-5" />
            الرتب
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={`flex-1 py-3 rounded-[16px] font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "badges"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="w-5 h-5" />
            الأوسمة
          </button>
        </div>
      </div>

      {/* Status Message */}
      {purchaseStatus && (
        <div
          className={`mx-4 mt-4 p-3 rounded-[14px] text-center ${
            purchaseStatus.type === "success"
              ? "bg-green-500/10 text-green-500"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {purchaseStatus.message}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {activeTab === "ranks" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              الرتب تمنحك مميزات خاصة وعملات إضافية كل ساعة
            </p>
            {rankOrder.map((rankKey) => {
              const rank = RANKS[rankKey]
              const isOwned = currentUser.rank === rankKey
              const currentRankIndex = rankOrder.indexOf(currentUser.rank as UserRank)
              const thisRankIndex = rankOrder.indexOf(rankKey)
              const isLowerRank = currentUser.rank !== "none" && thisRankIndex < currentRankIndex
              const canAfford = currentUser.coins >= rank.price

              return (
                <div
                  key={rankKey}
                  className="bg-card rounded-[24px] p-5 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-[18px] flex items-center justify-center"
                      style={{ backgroundColor: `${rank.color}20` }}
                    >
                      <Crown className="w-7 h-7" style={{ color: rank.color }} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-bold text-lg"
                        style={{ color: rank.color }}
                      >
                        {rank.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        +{rank.hourlyCoins.toLocaleString()} عملة/ساعة
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold text-foreground">
                        {rank.price.toLocaleString()}
                      </span>
                      <p className="text-xs text-muted-foreground">عملة</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        تغيير صورة الملف الشخصي
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        حظر المستخدمين الأقل رتبة
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        اسم ملون مميز
                      </li>
                    </ul>
                  </div>

                  {/* Purchase Button */}
                  <button
                    type="button"
                    onClick={() => handlePurchase("rank", rankKey)}
                    disabled={isOwned || isLowerRank || !canAfford || currentUser.isGuest}
                    className={`w-full mt-4 py-3 rounded-[14px] font-bold transition-all flex items-center justify-center gap-2 ${
                      isOwned
                        ? "bg-green-500/10 text-green-500 cursor-default"
                        : isLowerRank
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : !canAfford
                            ? "bg-destructive/10 text-destructive cursor-not-allowed"
                            : currentUser.isGuest
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {isOwned ? (
                      <>
                        <Check className="w-5 h-5" />
                        رتبتك الحالية
                      </>
                    ) : isLowerRank ? (
                      <>
                        <Check className="w-5 h-5" />
                        لديك رتبة أعلى
                      </>
                    ) : !canAfford ? (
                      <>
                        <Lock className="w-5 h-5" />
                        رصيد غير كافي
                      </>
                    ) : currentUser.isGuest ? (
                      <>
                        <Lock className="w-5 h-5" />
                        غير متاح للزوار
                      </>
                    ) : (
                      "شراء الآن"
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              الأوسمة تظهر في ملفك الشخصي وبجانب اسمك
            </p>
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map((badge) => {
                const isOwned = currentUser.badges.some((b) => b.id === badge.id)
                const canAfford = currentUser.coins >= badge.price

                return (
                  <div
                    key={badge.id}
                    className="bg-card rounded-[20px] p-4 border border-border"
                  >
                    <div className="text-center mb-3">
                      <span className="text-4xl block mb-2">{badge.icon}</span>
                      <h3 className="font-bold text-foreground text-sm">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {badge.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="font-bold text-foreground">
                        {badge.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePurchase("badge", badge.id)}
                      disabled={isOwned || !canAfford || currentUser.isGuest}
                      className={`w-full py-2.5 rounded-[12px] font-medium text-sm transition-all ${
                        isOwned
                          ? "bg-green-500/10 text-green-500 cursor-default"
                          : !canAfford
                            ? "bg-destructive/10 text-destructive cursor-not-allowed"
                            : currentUser.isGuest
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {isOwned ? "مملوك" : !canAfford ? "رصيد غير كافي" : "شراء"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
