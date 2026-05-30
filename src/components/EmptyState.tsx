import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel = 'Khám phá ngay',
  actionPath = '/',
}: EmptyStateProps) {
  return (
    <div id="empty-state" className="flex flex-col items-center justify-center text-center p-12 bg-zinc-900/40 rounded-2xl border border-zinc-900/80 backdrop-blur max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 animate-pulse">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 mb-6">{description}</p>
      {actionPath && (
        <Link
          id="empty-state-action"
          to={actionPath}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-500/20 active:scale-95 transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
