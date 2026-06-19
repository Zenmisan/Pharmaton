import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Production: service account JSON stored as env var on Railway
    try {
      // Railway converts \n escape sequences to real newlines in env vars — re-escape them
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\n/g, '\\n')
      const serviceAccount = JSON.parse(raw)
      initializeApp({ credential: cert(serviceAccount) })
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message)
      initializeApp({ projectId: 'zentribe-e8ba2' })
    }
  } else {
    // Local dev: use Application Default Credentials (or fall back to raw JWT decode in requireAuth)
    initializeApp({ projectId: 'zentribe-e8ba2' })
  }
}

export const auth = getAuth()
