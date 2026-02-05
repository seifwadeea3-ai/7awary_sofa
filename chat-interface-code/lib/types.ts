// User Ranks
export type UserRank = "none" | "bronze" | "silver" | "gold"

// Group Roles
export type GroupRole = "owner" | "admin" | "moderator" | "member"

// Badge Types
export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  price: number
}

// User Interface
export interface User {
  id: string
  username: string
  password?: string
  avatar: string
  bio: string
  isAdmin: boolean
  isGuest: boolean
  coins: number
  messageCount: number
  level: number
  rank: UserRank
  badges: Badge[]
  friends: string[]
  blockedUsers: string[]
  pendingFriendRequests: string[]
  createdAt: Date
  lastOnline: Date
  pendingCoins: number
  adminRating: number
}

// Group Interface
export interface Group {
  id: string
  name: string
  description: string
  image: string
  background: string
  ownerId: string
  members: GroupMember[]
  allowGuests: boolean
  isMuted: boolean
  createdAt: Date
}

// Group Member
export interface GroupMember {
  userId: string
  role: GroupRole
  joinedAt: Date
  isMuted: boolean
  isBanned: boolean
}

// Message Interface
export interface Message {
  id: string
  groupId: string
  senderId: string
  senderName: string
  senderAvatar: string
  senderRank: UserRank
  isAdmin: boolean
  content: string
  mentions: string[]
  timestamp: Date
  isAnnouncement: boolean
}

// Private Message
export interface PrivateMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
}

// Notification Interface
export interface Notification {
  id: string
  type: "login" | "mention" | "coins" | "friend_request" | "gift"
  title: string
  message: string
  fromUserId?: string
  fromAvatar?: string
  groupId?: string
  amount?: number
  read: boolean
  timestamp: Date
}

// Store Item
export interface StoreItem {
  id: string
  type: "rank" | "badge"
  name: string
  description: string
  price: number
  icon: string
  color?: string
}

// All available badges
export const BADGES: Badge[] = [
  { id: "lion", name: "وسام الأسد", icon: "🦁", description: "رمز القوة والشجاعة", price: 800 },
  { id: "falcon", name: "وسام الصقر", icon: "🦅", description: "رمز الحدة والانتباه", price: 800 },
  { id: "tiger", name: "وسام النمر", icon: "🐅", description: "رمز السرعة والذكاء", price: 800 },
  { id: "leopard", name: "وسام الفهد", icon: "🐆", description: "رمز السرعة والخفة", price: 800 },
  { id: "eagle", name: "وسام النسر", icon: "🦅", description: "رمز الطموح", price: 800 },
  { id: "bear", name: "وسام الدب", icon: "🐻", description: "رمز الصبر والقوة", price: 800 },
  { id: "elephant", name: "وسام الفيل", icon: "🐘", description: "رمز الحماية والقوة", price: 800 },
  { id: "fox", name: "وسام الثعلب", icon: "🦊", description: "رمز المكر والدهاء", price: 800 },
  { id: "deer", name: "وسام الغزال", icon: "🦌", description: "رمز الرشاقة", price: 800 },
  { id: "horse", name: "وسام الحصان", icon: "🐴", description: "رمز القدرة على التحمل", price: 800 },
]

// Rank configurations
export const RANKS: Record<UserRank, { name: string; price: number; color: string; hourlyCoins: number }> = {
  none: { name: "بدون رتبة", price: 0, color: "#8b9aa8", hourlyCoins: 1000 },
  bronze: { name: "برونزي", price: 3000, color: "#22c55e", hourlyCoins: 1000 },
  silver: { name: "فضي", price: 8000, color: "#3b82f6", hourlyCoins: 2000 },
  gold: { name: "ذهبي", price: 20000, color: "#eab308", hourlyCoins: 3000 },
}

// Get rank color
export function getRankColor(rank: UserRank): string {
  return RANKS[rank].color
}

// Get rank name in Arabic
export function getRankName(rank: UserRank): string {
  return RANKS[rank].name
}

// Check if user can block another based on rank
export function canBlock(blockerRank: UserRank, targetRank: UserRank): boolean {
  const rankOrder: UserRank[] = ["none", "bronze", "silver", "gold"]
  const blockerIndex = rankOrder.indexOf(blockerRank)
  const targetIndex = rankOrder.indexOf(targetRank)
  
  if (blockerRank === "none") return false
  if (blockerRank === "bronze") return targetRank === "none" || targetRank === "bronze"
  if (blockerRank === "silver") return targetRank === "none" || targetRank === "bronze"
  if (blockerRank === "gold") return targetIndex < blockerIndex
  
  return false
}
