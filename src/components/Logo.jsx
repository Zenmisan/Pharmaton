/* ─── LOGO ───────────────────────────────────────────────────── */
export function Logo({ size = 36, className = '' }) {
  return (
    <img
      src="/logo.png"
      alt="PharmaConnect"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', borderRadius: 6 }}
    />
  )
}
