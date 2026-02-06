"use client"

import { useApp } from "@/lib/app-context"
import { LoginScreen } from "./login-screen"
import { ChatLayout } from "./chat-layout"

export function MainApp() {
  const { currentUser } = useApp()

  if (!currentUser) {
    return <LoginScreen />
  }

  return <ChatLayout />
}
