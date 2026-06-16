import { createContext, useContext, useEffect, useState } from 'react'
import { api, setToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.me().then(({ user }) => setUser(user)).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { token, user } = await api.login({ email, password })
    setToken(token)
    setUser(user)
    return user
  }

  async function signup(payload) {
    const { token, user } = await api.signup(payload)
    setToken(token)
    setUser(user)
    return user
  }

  function signOut() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
