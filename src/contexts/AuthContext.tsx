import React, { createContext, useContext, useState } from 'react'
import type { User, Role } from '@/types'
import { MOCK_USERS } from '@/data/mock'

interface AuthContextValue {
  user: User | null
  login: (email: string, _password: string) => boolean
  logout: () => void
  isOwner: boolean
  isStaff: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function login(email: string, _password: string): boolean {
    const found = MOCK_USERS.find((u) => u.email === email && u.active)
    if (found) { setUser(found); return true }
    return false
  }

  function logout() { setUser(null) }

  return (
    <AuthContext.Provider value={{ user, login, logout, isOwner: user?.role === 'OWNER', isStaff: user?.role === 'STAFF' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
