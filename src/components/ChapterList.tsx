import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, BookOpen, Clock } from 'lucide-react';

interface Chapter {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  mangaSlug: string;
  currentChapterName?: string;
}

export default function ChapterList({
  chapters,
  mangaSlug,
  currentChapterName,
}: ChapterListProps) {
  const [isDesc, setIsDesc] = useState(true);

  if (!chapters || chapters.length === 0) {
    return (
      <div id="no-chapters-box" className="text-center py-8 text-zinc-500 text-sm bg-zinc-900/30 rounded-xl border border-zinc-850">
        Truyện chưa được cập nhật chương nào.
      </div>
    );
  }

  // Sort logic
  const sortedChapters = [...chapters].sort((a, b) => {
    // Attempt numeric sort
    const aNum = parseFloat(a.chapter_name) || 0;
    const bNum = parseFloat(b.chapter_name) || 0;
    if (aNum !== bNum) return isDesc ? bNum - aNum : aNum - bNum;
    
    // String fallback sort
    return isDesc
      ? b.chapter_name.localeCompare(a.chapter_name, undefined, { numeric: true })
      : a.chapter_name.localeCompare(b.chapter_name, undefined, { numeric: true });
  });

  return (
    <div id="chapter-list-section" className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-sm sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          Danh sách chương ({chapters.length})
        </h3>
        <button
          id="btn-toggle-sort"
          onClick={() => setIsDesc(!isDesc)}
          className="flex items-center gap-1 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 rounded-lg text-[10px] sm:text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
          {isDesc ? 'Mới nhất trước' : 'Cũ nhất trước'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {sortedChapters.map((chap) => {
          const isCurrent = currentChapterName === chap.chapter_name;
          return (
            <Link
              id={`chap-link-${chap.chapter_name}`}
              key={chap.chapter_name}
              to={`/doc-truyen/${mangaSlug}/${chap.chapter_name}?api=${encodeURIComponent(chap.chapter_api_data)}`}
              state={{ chapterApiUrl: chap.chapter_api_data }}
              className={`flex flex-col items-start gap-0.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all group ${
                isCurrent
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500 hover:border-purple-400 text-purple-200'
                  : 'bg-zinc-900 hover:bg-zinc-950 border-zinc-900 hover:border-zinc-800 text-zinc-300 hover:text-purple-400 hover:shadow shadow-purple-950/20'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold truncate w-full group-hover:translate-x-0.5 transition-transform">
                Chương {chap.chapter_name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-500 truncate w-full group-hover:text-zinc-400">
                {chap.chapter_title || `Chương ${chap.chapter_name}`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
