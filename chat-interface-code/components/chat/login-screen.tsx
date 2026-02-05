"use client"

import React from "react"

import { useState } from "react"
import { MessageCircle, Users, Sparkles, UserPlus, LogIn, UserX } from "lucide-react"
import { useApp } from "@/lib/app-context"

type AuthMode = "login" | "register" | "guest"

export function LoginScreen() {
  const { loginUser, registerUser, loginAsGuest } = useApp()
  const [mode, setMode] = useState<AuthMode>("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      if (mode === "login") {
        const result = loginUser(username, password)
        if (!result.success) {
          setError(result.error || "حدث خطأ")
        }
      } else if (mode === "register") {
        if (password.length < 6) {
          setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
          setIsLoading(false)
          return
        }
        const result = registerUser(username, password)
        if (!result.success) {
          setError(result.error || "حدث خطأ")
        }
      }
      setIsLoading(false)
    }, 600)
  }

  const handleGuestLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      loginAsGuest()
      setIsLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[30px] bg-primary/10 border-2 border-primary mb-4 orange-glow">
            <MessageCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">7awary Sofa</h1>
          <p className="text-muted-foreground text-lg">مجتمع الدردشة الحديث</p>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-[30px] p-8 border border-border">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError("") }}
              className={`flex-1 py-3 rounded-[16px] font-medium transition-all flex items-center justify-center gap-2 ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="w-4 h-4" />
              دخول
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError("") }}
              className={`flex-1 py-3 rounded-[16px] font-medium transition-all flex items-center justify-center gap-2 ${
                mode === "register"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسمك..."
                className="w-full bg-input border-0 rounded-[16px] px-5 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full bg-input border-0 rounded-[16px] px-5 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-[12px] text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!username.trim() || !password.trim() || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 orange-glow"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">أو</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Guest Login */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-medium py-3.5 rounded-[16px] transition-all flex items-center justify-center gap-2"
          >
            <UserX className="w-5 h-5 text-muted-foreground" />
            دخول كزائر
          </button>

          <p className="text-center text-muted-foreground text-xs mt-4">
            الزوار لا يمكنهم إرسال عملات أو شراء رتب
          </p>
        </div>

        {/* Tip */}
        <div className="text-center text-muted-foreground text-sm mt-6 space-y-2">
          <p>جرب تسجيل الدخول:</p>
          <div className="flex gap-4 justify-center">
            <span className="bg-secondary px-3 py-1 rounded-lg">
              <span className="text-primary font-bold">sofa</span> / admin123
            </span>
            <span className="bg-secondary px-3 py-1 rounded-lg">
              <span className="text-primary font-bold">أحمد</span> / 123456
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
