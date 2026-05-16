import { cn } from '@/lib/utils'

interface FieldProps { label: string; children: React.ReactNode; hint?: string; className?: string }
export function Field({ label, children, hint, className }: FieldProps) {
  return (
    <div className={cn('mb-5', className)}>
      <label className="font-mono text-xs text-[var(--cyan)] block mb-2 uppercase tracking-widest">{label}</label>
      {children}
      {hint && <p className="font-mono text-xs text-[var(--text-3)] mt-1.5">{hint}</p>}
    </div>
  )
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={cn('w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text)] text-sm outline-none transition-colors focus:border-[var(--cyan-2)] placeholder-[var(--text-3)]', className)} />
  )
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={cn('w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text)] text-sm outline-none transition-colors focus:border-[var(--cyan-2)] placeholder-[var(--text-3)] resize-y min-h-[80px]', className)} />
  )
}

interface SaveBtnProps { loading?: boolean; onClick: () => void; label?: string; className?: string }
export function SaveBtn({ loading, onClick, label = 'Save Changes', className }: SaveBtnProps) {
  return (
    <button onClick={onClick} disabled={loading}
      className={cn('px-5 py-2.5 rounded-lg font-semibold text-sm bg-[var(--cyan)] text-black transition-all duration-200 hover:bg-[var(--cyan-2)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2', className)}>
      {loading && <span className="block w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
      {label}
    </button>
  )
}

export function DeleteBtn({ onClick, label = 'Delete' }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--red)] bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.2)] hover:bg-[rgba(255,68,68,0.15)] transition-colors">
      {label}
    </button>
  )
}

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-4">
      <h3 className="font-mono text-xs text-[var(--cyan)] uppercase tracking-widest mb-6">{title}</h3>
      {children}
    </div>
  )
}
