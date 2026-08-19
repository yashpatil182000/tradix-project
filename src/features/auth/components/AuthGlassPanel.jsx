import { cn } from '@/lib/utils'
import './auth-glass.css'

export function AuthGlassPanel({ children, className }) {
  return (
    <div className={cn('auth-glass relative isolate', className)}>
      <div className="auth-glass-blob" aria-hidden="true" />
      <div className="auth-glass-halo" aria-hidden="true" />
      <div className="auth-glass-grid" aria-hidden="true" />
      <div className="auth-glass-shell">{children}</div>
    </div>
  )
}
