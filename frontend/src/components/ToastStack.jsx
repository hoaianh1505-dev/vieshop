import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle } from 'lucide-react';

const palette = {
  success: 'border-emerald-100 bg-emerald-50 text-emerald-800',
  error: 'border-red-150 bg-red-50 text-red-800',
};

export default function ToastStack() {
  const { toasts } = useApp();

  return (
    <div className="fixed right-4 top-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type !== 'error';
        const StatusIcon = isSuccess ? CheckCircle2 : XCircle;

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 min-w-72 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-panel bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-4 duration-350 ${
              palette[toast.type] || palette.success
            }`}
          >
            <StatusIcon size={16} className={isSuccess ? 'text-emerald-650' : 'text-red-500'} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

