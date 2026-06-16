import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { G } from '@/lib/gradients'

/* ─── BADGE ──────────────────────────────────────────────────── */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold',
  {
    variants: {
      status: {
        'In Stock':     'bg-green-light text-green-brand',
        'Low Stock':    'bg-yellow-50 text-yellow-800',
        'Out of Stock': 'bg-red-50 text-danger',
      },
    },
    defaultVariants: { status: 'In Stock' },
  }
)

const dotColors = {
  'In Stock':     'bg-green-mid',
  'Low Stock':    'bg-warning',
  'Out of Stock': 'bg-danger',
}

export function Badge({ status }) {
  return (
    <span className={badgeVariants({ status })}>
      <span className={cn('size-1.5 rounded-full', dotColors[status] || 'bg-green-mid')} />
      {status}
    </span>
  )
}

/* ─── CARD ───────────────────────────────────────────────────── */
export function Card({ children, className, onClick, style, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className={cn(
        'bg-surface rounded-2xl p-5 border border-border shadow-[0_1px_2px_rgba(20,19,15,0.04)] transition-shadow duration-200',
        onClick && 'cursor-pointer hover:shadow-[0_8px_28px_rgba(20,19,15,0.08)]',
        className
      )}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}

/* ─── BUTTON ─────────────────────────────────────────────────── */
const btnVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all duration-150 cursor-pointer border-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:   'text-white shadow-[0_4px_14px_rgba(27,63,196,0.25)] hover:shadow-[0_6px_20px_rgba(27,63,196,0.35)] hover:-translate-y-0.5',
        secondary: 'bg-white text-blue-brand border-[1.5px] border-blue-brand hover:bg-blue-light hover:-translate-y-0.5',
        ghost:     'bg-transparent text-muted border border-border hover:bg-background hover:text-text',
        danger:    'bg-red-50 text-danger border border-danger/25 hover:bg-red-100',
      },
      size: {
        sm: 'px-3.5 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export function Btn({ children, variant = 'primary', onClick, className, full, size = 'md', gradient, style = {} }) {
  const gradStyle = variant === 'primary'
    ? { background: gradient || G.main, border: 'none' }
    : {}
  return (
    <button
      onClick={onClick}
      className={cn(btnVariants({ variant, size }), full && 'w-full', className)}
      style={{ ...gradStyle, ...style }}
    >
      {children}
    </button>
  )
}
