import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Production: service account JSON stored as env var on Railway
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
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
