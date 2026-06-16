/* ─── LOGO ───────────────────────────────────────────────────── */
export function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="18" cy="28" r="6" fill="#1B3FC4" />
      <circle cx="8"  cy="52" r="5" fill="#1B3FC4" />
      <circle cx="32" cy="14" r="5" fill="#1B3FC4" />
      <line x1="18" y1="28" x2="8"  y2="52" stroke="#1B3FC4"  strokeWidth="2.5" />
      <line x1="18" y1="28" x2="32" y2="14" stroke="#1B3FC4"  strokeWidth="2.5" />
      <line x1="18" y1="28" x2="46" y2="27" stroke="#1B3FC4"  strokeWidth="2.5" />
      <circle cx="82" cy="28" r="6" fill="#16A34A" />
      <circle cx="92" cy="52" r="5" fill="#16A34A" />
      <circle cx="68" cy="14" r="5" fill="#16A34A" />
      <line x1="82" y1="28" x2="92" y2="52" stroke="#16A34A" strokeWidth="2.5" />
      <line x1="82" y1="28" x2="68" y2="14" stroke="#16A34A" strokeWidth="2.5" />
      <line x1="82" y1="28" x2="54" y2="27" stroke="#16A34A" strokeWidth="2.5" />
      <path d="M50 8 C34 8 23 21 23 35 C23 53 50 80 50 80 C50 80 77 53 77 35 C77 21 66 8 50 8Z" fill="url(#lg)" />
      <defs>
        <linearGradient id="lg" x1="23" y1="8" x2="77" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1B3FC4" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <rect x="40" y="20" width="20" height="20" rx="3" fill="white" />
      <rect x="48" y="22" width="4"  height="16" rx="2" fill="#16A34A" />
      <rect x="41" y="28" width="18" height="4"  rx="2" fill="#16A34A" />
      <ellipse cx="50" cy="82" rx="9" ry="3.5" fill="rgba(0,0,0,0.12)" />
    </svg>
  )
}
