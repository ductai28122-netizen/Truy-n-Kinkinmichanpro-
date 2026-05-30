import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Calendar } from 'lucide-react';
import { MangaItem } from '../types';
import { getMangaCoverUrl, formatStatus, formatStatusColor } from '../utils/manga_helpers';

interface MangaCardProps {
  key?: any;
  manga: MangaItem | {
    _id: string;
    name: string;
    slug: string;
    thumb_url: string;
    status: string;
    category?: { name: string; slug: string }[];
    updatedAt?: string | number;
  };
  cdnImage?: string;
  index?: number;
}

export default function MangaCard({ manga, cdnImage, index = 0 }: MangaCardProps) {
  const coverUrl = getMangaCoverUrl(manga.thumb_url, cdnImage);
  
  // Handle categories fallback safely
  const categories = Array.isArray(manga.category) ? manga.category : [];
  
  // Handle latest chapter fallback safely
  let latestChapters: any[] = [];
  if (manga && 'chaptersLatest' in manga && Array.isArray(manga.chaptersLatest)) {
    latestChapters = manga.chaptersLatest;
  }
  const latestChapter = latestChapters.length > 0 ? latestChapters[0] : null;

  const hasSlug = !!manga.slug;
  const detailPath = hasSlug ? `/truyen/${manga.slug}` : '#';

  return (
    <motion.div
      id={`manga-card-${manga.slug}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative flex flex-col h-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-purple-500/30 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-purple-500/5"
    >
      {/* Aspect Ratio box for the cover image */}
      <Link to={detailPath} className="relative aspect-[2/3] w-full overflow-hidden block">
        {/* Hover backdrop gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 z-10" />
        
        {/* Status Badge */}
        {manga.status && (
          <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[8px] sm:text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${formatStatusColor(manga.status)}`}>
            {formatStatus(manga.status)}
          </span>
        )}

        {/* Core Image */}
        <img
          src={coverUrl}
          alt={manga.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=350&auto=format&fit=crop';
          }}
        />

        {/* Hover Quick Read overlay */}
        <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <span className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-[10px] sm:text-xs font-bold text-white shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Đọc Truyện
          </span>
        </div>
      </Link>

      {/* Comic text details */}
      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        {/* Categories labels */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
            {categories.slice(0, 2).map((cat) => (
              <span key={cat.slug} className="text-[9px] sm:text-[10px] text-zinc-400 font-medium">
                #{cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link 
          to={detailPath}
          className="text-xs sm:text-base font-extrabold text-zinc-100 hover:text-purple-400 line-clamp-2 leading-tight transition-colors mb-1.5 sm:mb-2 cursor-pointer flex-grow break-words"
        >
          {manga.name}
        </Link>

        {/* Latest chapter box */}
        <div className="flex items-center justify-between pt-1.5 border-t border-zinc-900 gap-1">
          {latestChapter ? (
            <Link
              to={hasSlug ? `/doc-truyen/${manga.slug}/${latestChapter.chapter_name}?api=${encodeURIComponent(latestChapter.chapter_api_data)}` : '#'}
              state={{ chapterApiUrl: latestChapter.chapter_api_data }}
              className="text-[10px] sm:text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-600 hover:text-white hover:border-purple-600 px-2 py-0.5 rounded-lg transition-all line-clamp-1 flex-shrink-0 cursor-pointer max-w-full"
            >
              Chương {latestChapter.chapter_name}
            </Link>
          ) : (
            <span className="text-[10px] sm:text-xs text-zinc-550">Chưa có</span>
          )}

          {manga.updatedAt && (
            <span className="text-[8px] sm:text-[10px] text-zinc-500 flex items-center gap-0.5 flex-shrink-0">
              <Calendar className="w-2.5 h-2.5" />
              {typeof manga.updatedAt === 'string' 
                ? new Date(manga.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
                : new Date(manga.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
