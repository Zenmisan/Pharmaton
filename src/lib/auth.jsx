import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged
} from 'firebase/auth'
import { api, setToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth state changes and token refreshes
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        setToken(token)
        try {
          // Fetch user metadata from our backend
          const { user: dbUser } = await api.me()
          setUser(dbUser)
        } catch (e) {
          console.error("Failed to fetch user metadata", e)
          setUser(null)
        }
      } else {
        setToken(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  async function login(email, password) {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
    const token = await firebaseUser.getIdToken()
    setToken(token)
    const { user: dbUser } = await api.me()
    setUser(dbUser)
    return dbUser
  }

  async function signup(payload) {
    const { email, password, ...rest } = payload
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    const token = await firebaseUser.getIdToken()
    setToken(token)
    
    // Sync metadata to our backend
    const { user: dbUser } = await api.signup({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      ...rest
    })
    
    setUser(dbUser)
    return dbUser
  }

  async function signOut() {
    await firebaseSignOut(auth)
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
