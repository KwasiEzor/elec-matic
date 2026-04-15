import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Plus, AlertCircle, CheckCircle } from 'lucide-react';

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{title}</h1>
          {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </motion.div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0D1321] border border-white/5 rounded-2xl p-5 sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-white/5">
      <div>
        <h3 className="text-white font-bold">{title}</h3>
        {description && <p className="text-slate-500 text-sm mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function InputField({
  label, name, type = 'text', value, onChange, placeholder, required, error, rows, disabled, className = ''
}: {
  label: string; name: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; required?: boolean; error?: string; rows?: number; disabled?: boolean; className?: string;
}) {
  const baseClass = `w-full px-4 py-3 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-slate-600 focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all outline-none disabled:opacity-50 ${
    error ? 'border-red-500/50' : 'border-white/10'
  } ${className}`;
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-amber">*</span>}
      </label>
      {rows ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows} disabled={disabled} className={`${baseClass} resize-none`} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} className={baseClass} />
      )}
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label, name, value, onChange, options, required
}: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-amber">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all outline-none appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0D1321]">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function SaveButton({ onClick, loading, saved }: { onClick?: () => void; loading?: boolean; saved?: boolean }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
        saved
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-gradient-to-r from-amber to-amber-light text-[#0D1321] hover:shadow-lg hover:shadow-amber/20 hover:-translate-y-0.5'
      }`}
    >
      {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegardé</> : <><Save className="w-4 h-4" /> Enregistrer</>}
    </button>
  );
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
    >
      <Trash2 className="w-4 h-4" /> Supprimer
    </button>
  );
}

export function AddButton({ onClick, label = 'Ajouter' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20 transition-all"
    >
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

export function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border ${
        type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
}
