/* ─── LOGO ───────────────────────────────────────────────────── */
export function Logo({ size = 36, className = '' }) {
  return (
    <img
      src="/IMG-20260617-WA0063.jpg"
      alt="PharmaConnect"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', borderRadius: 6 }}
    />
  )
}
