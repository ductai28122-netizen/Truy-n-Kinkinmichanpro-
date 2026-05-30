import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Không thể tải dữ liệu, vui lòng thử lại.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div id="error-state" className="flex flex-col items-center justify-center text-center p-12 bg-zinc-900/40 rounded-2xl border border-rose-500/15 backdrop-blur max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-zinc-100 mb-2">Đã xảy ra lỗi</h3>
      <p className="text-sm text-zinc-400 mb-6">{message}</p>
      {onRetry && (
        <button
          id="error-state-retry"
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          Tải lại dữ liệu
        </button>
      )}
    </div>
  );
}
