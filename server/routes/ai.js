import express from 'express'

const router = express.Router()

router.post('/', async (req, res) => {
  const { system, user } = req.body
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!user) return res.status(400).json({ error: 'user message required' })
  if (!apiKey) return res.json({ result: 'AI features require ANTHROPIC_API_KEY to be set in server/.env' })

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    })
    const d = await r.json()
    if (d.error) return res.json({ result: `AI error: ${d.error.message}` })
    const text = d.content?.map(i => i.text || '').join('') || ''
    res.json({ result: text })
  } catch (e) {
    res.status(502).json({ result: 'AI unavailable. Please check server connection and API key.' })
  }
})

export default router
