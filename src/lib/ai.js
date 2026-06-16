import { api } from '@/lib/api'

/* ─── AI HELPER ──────────────────────────────────────────────── */
export async function callAI(system, user) {
  try {
    const { result } = await api.ai(system, user)
    return result
  } catch (e) {
    return `AI unavailable: ${e.message}`
  }
}
