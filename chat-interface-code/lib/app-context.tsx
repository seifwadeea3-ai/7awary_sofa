"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User, Group, Message, Notification, Badge, UserRank, PrivateMessage } from "./types"
import { BADGES, RANKS } from "./types"

interface AppContextType {
  // Current user
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  // Users
  users: User[]
  registerUser: (username: string, password: string) => { success: boolean; error?: string }
  loginUser: (username: string, password: string) => { success: boolean; error?: string }
  loginAsGuest: () => void
  logout: () => void
  updateUser: (userId: string, updates: Partial<User>) => void
  
  // Coins
  collectPendingCoins: () => number
  transferCoins: (toUserId: string, amount: number) => { success: boolean; error?: string }
  purchaseItem: (type: "rank" | "badge", itemId: string) => { success: boolean; error?: string }
  
  // Groups
  groups: Group[]
  currentGroup: Group | null
  setCurrentGroup: (group: Group | null) => void
  createGroup: (name: string, description: string) => Group
  updateGroup: (groupId: string, updates: Partial<Group>) => void
  joinGroup: (groupId: string) => { success: boolean; error?: string }
  leaveGroup: (groupId: string) => void
  kickMember: (groupId: string, userId: string) => void
  banMember: (groupId: string, userId: string) => void
  muteMember: (groupId: string, userId: string) => void
  updateMemberRole: (groupId: string, userId: string, role: "admin" | "moderator" | "member") => void
  
  // Messages
  messages: Message[]
  sendMessage: (groupId: string, content: string) => void
  
  // Private Messages (Admin only)
  privateMessages: PrivateMessage[]
  sendPrivateMessage: (toUserId: string, content: string) => void
  
  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  
  // Admin actions
  globalMute: boolean
  setGlobalMute: (muted: boolean) => void
  broadcastMessage: (content: string) => void
  resetUserCoins: (userId: string) => void
  banUserIP: (userId: string) => void
  
  // Gift timer
  giftTimeRemaining: number
  
  // View state
  currentView: "chat" | "store" | "profile" | "groups" | "notifications" | "admin" | "private-chat"
  setCurrentView: (view: "chat" | "store" | "profile" | "groups" | "notifications" | "admin" | "private-chat") => void
  selectedUserId: string | null
  setSelectedUserId: (id: string | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

// Sample users for demo
const SAMPLE_USERS: User[] = [
  {
    id: "admin-sofa",
    username: "its_sofa",
    password: "s1e2i3f4#",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofa",
    bio: "مشرف الموقع الرسمي",
    isAdmin: true,
    isGuest: false,
    coins: 999999,
    messageCount: 50000,
    level: 10,
    rank: "gold",
    badges: BADGES.slice(0, 10),
    friends: [],
    blockedUsers: [],
    pendingFriendRequests: [],
    createdAt: new Date(2024, 0, 1),
    lastOnline: new Date(),
    pendingCoins: 0,
    adminRating: 5,
  },
  {
    id: "user-ahmed",
    username: "أحمد",
    password: "123456",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    bio: "مرحبا بكم",
    isAdmin: false,
    isGuest: false,
    coins: 5000,
    messageCount: 150,
    level: 3,
    rank: "bronze",
    badges: [BADGES[0]],
    friends: [],
    blockedUsers: [],
    pendingFriendRequests: [],
    createdAt: new Date(2024, 5, 15),
    lastOnline: new Date(),
    pendingCoins: 500,
    adminRating: 4,
  },
  {
    id: "user-sara",
    username: "سارة",
    password: "123456",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
    bio: "السلام عليكم",
    isAdmin: false,
    isGuest: false,
    coins: 12000,
    messageCount: 320,
    level: 5,
    rank: "silver",
    badges: [BADGES[1], BADGES[2]],
    friends: [],
    blockedUsers: [],
    pendingFriendRequests: [],
    createdAt: new Date(2024, 3, 20),
    lastOnline: new Date(),
    pendingCoins: 1200,
    adminRating: 5,
  },
]

// Sample groups
const SAMPLE_GROUPS: Group[] = [
  {
    id: "group-main",
    name: "الغرفة الرئيسية",
    description: "غرفة الدردشة العامة للجميع",
    image: "https://api.dicebear.com/7.x/identicon/svg?seed=main",
    background: "#0b0f11",
    ownerId: "admin-sofa",
    members: [
      { userId: "admin-sofa", role: "owner", joinedAt: new Date(2024, 0, 1), isMuted: false, isBanned: false },
      { userId: "user-ahmed", role: "member", joinedAt: new Date(2024, 5, 15), isMuted: false, isBanned: false },
      { userId: "user-sara", role: "moderator", joinedAt: new Date(2024, 3, 20), isMuted: false, isBanned: false },
    ],
    allowGuests: true,
    isMuted: false,
    createdAt: new Date(2024, 0, 1),
  },
  {
    id: "group-gaming",
    name: "غرفة الألعاب",
    description: "للحديث عن الألعاب والجيمنج",
    image: "https://api.dicebear.com/7.x/identicon/svg?seed=gaming",
    background: "#0b0f11",
    ownerId: "user-ahmed",
    members: [
      { userId: "user-ahmed", role: "owner", joinedAt: new Date(2024, 6, 1), isMuted: false, isBanned: false },
      { userId: "admin-sofa", role: "admin", joinedAt: new Date(2024, 6, 2), isMuted: false, isBanned: false },
    ],
    allowGuests: false,
    isMuted: false,
    createdAt: new Date(2024, 6, 1),
  },
]

// Sample messages
const SAMPLE_MESSAGES: Message[] = [
  {
    id: "msg-1",
    groupId: "group-main",
    senderId: "user-ahmed",
    senderName: "أحمد",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    senderRank: "bronze",
    isAdmin: false,
    content: "مرحبا بالجميع!",
    mentions: [],
    timestamp: new Date(Date.now() - 300000),
    isAnnouncement: false,
  },
  {
    id: "msg-2",
    groupId: "group-main",
    senderId: "user-sara",
    senderName: "سارة",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
    senderRank: "silver",
    isAdmin: false,
    content: "أهلا أحمد، كيف حالك؟",
    mentions: ["user-ahmed"],
    timestamp: new Date(Date.now() - 240000),
    isAnnouncement: false,
  },
  {
    id: "msg-3",
    groupId: "group-main",
    senderId: "admin-sofa",
    senderName: "its_sofa",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofa",
    senderRank: "gold",
    isAdmin: true,
    content: "أهلا بالجميع في 7awary Sofa!",
    mentions: [],
    timestamp: new Date(Date.now() - 180000),
    isAnnouncement: false,
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS)
  const [groups, setGroups] = useState<Group[]>(SAMPLE_GROUPS)
  const [currentGroup, setCurrentGroup] = useState<Group | null>(SAMPLE_GROUPS[0])
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [globalMute, setGlobalMute] = useState(false)
  const [giftTimeRemaining, setGiftTimeRemaining] = useState(300)
  const [currentView, setCurrentView] = useState<"chat" | "store" | "profile" | "groups" | "notifications" | "admin" | "private-chat">("chat")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Gift timer countdown
  useEffect(() => {
    if (!currentUser) return

    const interval = setInterval(() => {
      setGiftTimeRemaining((prev) => {
        if (prev <= 1) {
          // Add pending coins based on rank
          const hourlyCoins = RANKS[currentUser.rank].hourlyCoins
          setCurrentUser((user) =>
            user ? { ...user, pendingCoins: user.pendingCoins + hourlyCoins } : null
          )
          return 300 // Reset to 5 minutes
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentUser])

  // Register new user
  const registerUser = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "اسم المستخدم موجود بالفعل" }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: "",
      isAdmin: false,
      isGuest: false,
      coins: 0,
      messageCount: 0,
      level: 1,
      rank: "none",
      badges: [],
      friends: [],
      blockedUsers: [],
      pendingFriendRequests: [],
      createdAt: new Date(),
      lastOnline: new Date(),
      pendingCoins: 0,
      adminRating: 0,
    }

    setUsers((prev) => [...prev, newUser])
    setCurrentUser(newUser)
    
    // Add login notification
    addNotification({
      type: "login",
      title: "مرحبا بك!",
      message: `تم تسجيل الدخول كـ ${username}`,
    })

    return { success: true }
  }, [users])

  // Login user
  const loginUser = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )

    if (!user) {
      return { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" }
    }

    setCurrentUser({ ...user, lastOnline: new Date() })
    addNotification({
      type: "login",
      title: "مرحبا بعودتك!",
      message: `تم تسجيل الدخول كـ ${username}`,
    })

    return { success: true }
  }, [users])

  // Login as guest
  const loginAsGuest = useCallback(() => {
    const guestId = `guest-${Date.now()}`
    const guestUser: User = {
      id: guestId,
      username: `زائر_${Math.floor(Math.random() * 10000)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestId}`,
      bio: "",
      isAdmin: false,
      isGuest: true,
      coins: 0,
      messageCount: 0,
      level: 1,
      rank: "none",
      badges: [],
      friends: [],
      blockedUsers: [],
      pendingFriendRequests: [],
      createdAt: new Date(),
      lastOnline: new Date(),
      pendingCoins: 0,
      adminRating: 0,
    }

    setCurrentUser(guestUser)
  }, [])

  // Logout
  const logout = useCallback(() => {
    setCurrentUser(null)
    setCurrentView("chat")
    setGiftTimeRemaining(300)
  }, [])

  // Update user
  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    )
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }, [currentUser])

  // Collect pending coins
  const collectPendingCoins = useCallback((): number => {
    if (!currentUser) return 0
    const collected = currentUser.pendingCoins
    setCurrentUser((prev) =>
      prev ? { ...prev, coins: prev.coins + collected, pendingCoins: 0 } : null
    )
    return collected
  }, [currentUser])

  // Transfer coins (15% fee to admin)
  const transferCoins = useCallback((toUserId: string, amount: number): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: "يجب تسجيل الدخول" }
    if (currentUser.isGuest) return { success: false, error: "الزوار لا يمكنهم إرسال عملات" }
    if (currentUser.coins < amount) return { success: false, error: "رصيد غير كافي" }

    const fee = Math.floor(amount * 0.15)
    const netAmount = amount - fee

    // Deduct from sender
    setCurrentUser((prev) =>
      prev ? { ...prev, coins: prev.coins - amount } : null
    )

    // Add to receiver
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === toUserId) {
          return { ...u, coins: u.coins + netAmount }
        }
        if (u.id === "admin-sofa") {
          return { ...u, coins: u.coins + fee }
        }
        return u
      })
    )

    // Notification to receiver
    const receiver = users.find((u) => u.id === toUserId)
    if (receiver) {
      addNotification({
        type: "coins",
        title: "استلمت عملات!",
        message: `${currentUser.username} أرسل لك ${netAmount} عملة`,
        fromUserId: currentUser.id,
        fromAvatar: currentUser.avatar,
        amount: netAmount,
      })
    }

    return { success: true }
  }, [currentUser, users])

  // Purchase item
  const purchaseItem = useCallback((type: "rank" | "badge", itemId: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: "يجب تسجيل الدخول" }
    if (currentUser.isGuest) return { success: false, error: "الزوار لا يمكنهم الشراء" }

    if (type === "rank") {
      const rank = itemId as UserRank
      const rankInfo = RANKS[rank]
      if (currentUser.coins < rankInfo.price) {
        return { success: false, error: "رصيد غير كافي" }
      }
      setCurrentUser((prev) =>
        prev ? { ...prev, coins: prev.coins - rankInfo.price, rank } : null
      )
      return { success: true }
    }

    if (type === "badge") {
      const badge = BADGES.find((b) => b.id === itemId)
      if (!badge) return { success: false, error: "الوسام غير موجود" }
      if (currentUser.badges.some((b) => b.id === itemId)) {
        return { success: false, error: "لديك هذا الوسام بالفعل" }
      }
      if (currentUser.coins < badge.price) {
        return { success: false, error: "رصيد غير كافي" }
      }
      setCurrentUser((prev) =>
        prev ? { ...prev, coins: prev.coins - badge.price, badges: [...prev.badges, badge] } : null
      )
      return { success: true }
    }

    return { success: false, error: "نوع غير معروف" }
  }, [currentUser])

  // Create group
  const createGroup = useCallback((name: string, description: string): Group => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      description,
      image: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
      background: "#0b0f11",
      ownerId: currentUser!.id,
      members: [
        { userId: currentUser!.id, role: "owner", joinedAt: new Date(), isMuted: false, isBanned: false },
      ],
      allowGuests: true,
      isMuted: false,
      createdAt: new Date(),
    }
    setGroups((prev) => [...prev, newGroup])
    return newGroup
  }, [currentUser])

  // Update group
  const updateGroup = useCallback((groupId: string, updates: Partial<Group>) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...updates } : g))
    )
    if (currentGroup?.id === groupId) {
      setCurrentGroup((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }, [currentGroup])

  // Join group
  const joinGroup = useCallback((groupId: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: "يجب تسجيل الدخول" }

    const group = groups.find((g) => g.id === groupId)
    if (!group) return { success: false, error: "المجموعة غير موجودة" }
    if (!group.allowGuests && currentUser.isGuest) {
      return { success: false, error: "هذه المجموعة لا تسمح للزوار" }
    }
    if (group.members.some((m) => m.userId === currentUser.id)) {
      return { success: false, error: "أنت عضو بالفعل" }
    }

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: [
                ...g.members,
                { userId: currentUser.id, role: "member", joinedAt: new Date(), isMuted: false, isBanned: false },
              ],
            }
          : g
      )
    )

    return { success: true }
  }, [currentUser, groups])

  // Leave group
  const leaveGroup = useCallback((groupId: string) => {
    if (!currentUser) return
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((m) => m.userId !== currentUser.id) }
          : g
      )
    )
  }, [currentUser])

  // Kick member
  const kickMember = useCallback((groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, members: g.members.filter((m) => m.userId !== userId) } : g
      )
    )
  }, [])

  // Ban member
  const banMember = useCallback((groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map((m) =>
                m.userId === userId ? { ...m, isBanned: true } : m
              ),
            }
          : g
      )
    )
  }, [])

  // Mute member
  const muteMember = useCallback((groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map((m) =>
                m.userId === userId ? { ...m, isMuted: !m.isMuted } : m
              ),
            }
          : g
      )
    )
  }, [])

  // Update member role
  const updateMemberRole = useCallback((groupId: string, userId: string, role: "admin" | "moderator" | "member") => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map((m) =>
                m.userId === userId ? { ...m, role } : m
              ),
            }
          : g
      )
    )
  }, [])

  // Send message
  const sendMessage = useCallback((groupId: string, content: string) => {
    if (!currentUser || globalMute) return

    // Extract mentions
    const mentionRegex = /@(\S+)/g
    const mentions: string[] = []
    let match
    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedUser = users.find((u) => u.username === match[1])
      if (mentionedUser) {
        mentions.push(mentionedUser.id)
        // Send notification
        addNotification({
          type: "mention",
          title: "تم ذكرك!",
          message: `${currentUser.username} قام بذكرك في ${groups.find((g) => g.id === groupId)?.name}`,
          fromUserId: currentUser.id,
          fromAvatar: currentUser.avatar,
          groupId,
        })
      }
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      groupId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.avatar,
      senderRank: currentUser.rank,
      isAdmin: currentUser.isAdmin,
      content,
      mentions,
      timestamp: new Date(),
      isAnnouncement: false,
    }

    setMessages((prev) => [...prev, newMessage])

    // Update message count
    setCurrentUser((prev) =>
      prev ? { ...prev, messageCount: prev.messageCount + 1 } : null
    )

    // Level up check (every 100 messages)
    if ((currentUser.messageCount + 1) % 100 === 0 && currentUser.level < 10) {
      setCurrentUser((prev) =>
        prev ? { ...prev, level: prev.level + 1 } : null
      )
    }
  }, [currentUser, globalMute, users, groups])

  // Send private message (all users)
  const sendPrivateMessage = useCallback((toUserId: string, content: string) => {
    if (!currentUser || currentUser.isGuest) return

    const newMessage: PrivateMessage = {
      id: `pm-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: toUserId,
      content,
      timestamp: new Date(),
      read: false,
    }

    setPrivateMessages((prev) => [...prev, newMessage])
    
    // Send notification to receiver
    const receiver = users.find((u) => u.id === toUserId)
    if (receiver) {
      addNotification({
        type: "mention",
        title: "رسالة خاصة!",
        message: `${currentUser.username} أرسل لك رسالة خاصة`,
        fromUserId: currentUser.id,
        fromAvatar: currentUser.avatar,
      })
    }
  }, [currentUser, users])

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  // Mark notification read
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Broadcast message (admin)
  const broadcastMessage = useCallback((content: string) => {
    if (!currentUser?.isAdmin) return

    const announcement: Message = {
      id: `msg-${Date.now()}`,
      groupId: currentGroup?.id || "group-main",
      senderId: currentUser.id,
      senderName: "إعلان من الإدارة",
      senderAvatar: currentUser.avatar,
      senderRank: "gold",
      isAdmin: true,
      content,
      mentions: [],
      timestamp: new Date(),
      isAnnouncement: true,
    }

    setMessages((prev) => [...prev, announcement])

    // Notify all users
    users.forEach((u) => {
      if (u.id !== currentUser.id) {
        addNotification({
          type: "login",
          title: "إعلان من الإدارة",
          message: content,
          fromUserId: currentUser.id,
          fromAvatar: currentUser.avatar,
        })
      }
    })
  }, [currentUser, currentGroup, users])

  // Reset user coins (admin)
  const resetUserCoins = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, coins: 0, pendingCoins: 0 } : u))
    )
  }, [])

  // Ban user IP (admin)
  const banUserIP = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    // Remove from all groups
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        members: g.members.filter((m) => m.userId !== userId),
      }))
    )
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        registerUser,
        loginUser,
        loginAsGuest,
        logout,
        updateUser,
        collectPendingCoins,
        transferCoins,
        purchaseItem,
        groups,
        currentGroup,
        setCurrentGroup,
        createGroup,
        updateGroup,
        joinGroup,
        leaveGroup,
        kickMember,
        banMember,
        muteMember,
        updateMemberRole,
        messages,
        sendMessage,
        privateMessages,
        sendPrivateMessage,
        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
        globalMute,
        setGlobalMute,
        broadcastMessage,
        resetUserCoins,
        banUserIP,
        giftTimeRemaining,
        currentView,
        setCurrentView,
        selectedUserId,
        setSelectedUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
