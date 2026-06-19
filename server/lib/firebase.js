import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT
      // Support both base64-encoded and raw JSON (base64 avoids Railway newline mangling)
      const normalize = str => str.startsWith('{')
        ? str.replace(/\n/g, '\\n')          // raw JSON with actual newlines
        : Buffer.from(str, 'base64').toString('utf8').replace(/\n/g, '\\n') // base64-encoded
      const serviceAccount = JSON.parse(normalize(raw.trim()))
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
