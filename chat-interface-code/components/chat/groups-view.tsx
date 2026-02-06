"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  Users,
  Plus,
  Hash,
  Lock,
  Settings,
  UserPlus,
  LogOut,
  Check,
  X,
  Crown,
  Shield,
  UserCheck,
} from "lucide-react"

export function GroupsView() {
  const {
    currentUser,
    groups,
    currentGroup,
    setCurrentGroup,
    setCurrentView,
    createGroup,
    joinGroup,
    leaveGroup,
    updateGroup,
    users,
  } = useApp()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDesc, setNewGroupDesc] = useState("")
  const [error, setError] = useState("")

  if (!currentUser) return null

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      setError("أدخل اسم المجموعة")
      return
    }
    const group = createGroup(newGroupName.trim(), newGroupDesc.trim())
    setCurrentGroup(group)
    setShowCreateModal(false)
    setNewGroupName("")
    setNewGroupDesc("")
    setError("")
  }

  const handleJoinGroup = (groupId: string) => {
    const result = joinGroup(groupId)
    if (!result.success) {
      setError(result.error || "حدث خطأ")
      setTimeout(() => setError(""), 3000)
    }
  }

  const getMemberRole = (groupId: string, userId: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.members.find((m) => m.userId === userId)?.role
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3.5 h-3.5 text-yellow-500" />
      case "admin":
        return <Shield className="w-3.5 h-3.5 text-primary" />
      case "moderator":
        return <UserCheck className="w-3.5 h-3.5 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground text-lg">الجروبات</h2>
            <p className="text-xs text-muted-foreground">
              {groups.length} مجموعة متاحة
            </p>
          </div>
          {!currentUser.isGuest && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-4 p-3 rounded-[14px] text-center bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {groups.map((group) => {
          const isMember = group.members.some((m) => m.userId === currentUser.id)
          const myRole = getMemberRole(group.id, currentUser.id)
          const isSelected = currentGroup?.id === group.id

          return (
            <div
              key={group.id}
              className={`bg-card rounded-[20px] p-4 border transition-all ${
                isSelected ? "border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-secondary flex-shrink-0">
                  <img
                    src={group.image || "/placeholder.svg"}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary flex-shrink-0" />
                    <h3 className="font-bold text-foreground truncate">
                      {group.name}
                    </h3>
                    {!group.allowGuests && (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    {myRole && getRoleIcon(myRole)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {group.description || "بدون وصف"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {group.members.length} عضو
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {isMember ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentGroup(group)
                          setCurrentView("chat")
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-[12px]"
                      >
                        دخول
                      </button>
                      {myRole === "owner" && (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentGroup(group)
                            setShowSettingsModal(true)
                          }}
                          className="p-2 bg-secondary text-foreground rounded-[10px]"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={!group.allowGuests && currentUser.isGuest}
                      className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-[12px] hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      انضمام
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[24px] p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-foreground text-lg">إنشاء جروب</h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  setError("")
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم الجروب
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="أدخل الاسم..."
                  className="w-full bg-input rounded-[14px] px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  وصف الجروب (اختياري)
                </label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="أدخل الوصف..."
                  className="w-full bg-input rounded-[14px] px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                />
              </div>

              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleCreateGroup}
                className="w-full bg-primary text-primary-foreground py-3 rounded-[14px] font-bold"
              >
                إنشاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Settings Modal */}
      {showSettingsModal && currentGroup && (
        <GroupSettingsModal
          group={currentGroup}
          onClose={() => setShowSettingsModal(false)}
          updateGroup={updateGroup}
          leaveGroup={leaveGroup}
          users={users}
        />
      )}
    </div>
  )
}

interface GroupSettingsModalProps {
  group: ReturnType<typeof useApp>["currentGroup"]
  onClose: () => void
  updateGroup: ReturnType<typeof useApp>["updateGroup"]
  leaveGroup: ReturnType<typeof useApp>["leaveGroup"]
  users: ReturnType<typeof useApp>["users"]
}

function GroupSettingsModal({
  group,
  onClose,
  updateGroup,
  leaveGroup,
  users,
}: GroupSettingsModalProps) {
  const [name, setName] = useState(group?.name || "")
  const [description, setDescription] = useState(group?.description || "")
  const [allowGuests, setAllowGuests] = useState(group?.allowGuests || false)

  if (!group) return null

  const handleSave = () => {
    updateGroup(group.id, { name, description, allowGuests })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-[24px] p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-foreground text-lg">إعدادات الجروب</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              اسم الجروب
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input rounded-[14px] px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-input rounded-[14px] px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground">السماح للزوار</span>
            <button
              type="button"
              onClick={() => setAllowGuests(!allowGuests)}
              className={`w-12 h-6 rounded-full transition-colors ${
                allowGuests ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  allowGuests ? "-translate-x-6" : "-translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Members */}
          <div>
            <h4 className="font-medium text-foreground mb-3">
              الأعضاء ({group.members.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {group.members.map((member) => {
                const user = users.find((u) => u.id === member.userId)
                if (!user) return null
                return (
                  <div
                    key={member.userId}
                    className="flex items-center gap-3 p-2 bg-secondary rounded-[12px]"
                  >
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-foreground flex-1">{user.username}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {member.role}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-[14px] font-bold"
            >
              حفظ
            </button>
            <button
              type="button"
              onClick={() => {
                leaveGroup(group.id)
                onClose()
              }}
              className="px-4 bg-destructive/10 text-destructive py-3 rounded-[14px] font-bold"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
