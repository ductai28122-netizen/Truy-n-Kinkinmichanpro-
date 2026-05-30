import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, BookOpen, Clock, X, ChevronRight, RefreshCw } from 'lucide-react';
import { HistoryItem } from '../types';
import { getHistory, removeFromHistory, clearAllHistory, getMangaCoverUrl } from '../utils/manga_helpers';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';

export default function History() {
  const { showToast } = useToast();
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    setHistoryList(getHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRemoveItem = (slug: string, name: string) => {
    const updated = removeFromHistory(slug);
    setHistoryList(updated);
    showToast('info', `Đã xóa "${name}" khỏi lịch sử đọc.`);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử đọc truyện?')) {
      clearAllHistory();
      setHistoryList([]);
      showToast('info', 'Đã xóa sạch toàn bộ lịch sử đọc truyện.');
    }
  };

  return (
    <div id="history-page" className="min-h-screen bg-zinc-950 pt-3 sm:pt-6 pb-16 text-zinc-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        
        {/* Header summary segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-1">
              <Clock className="w-4 h-4 text-purple-400" />
              Tủ sách cá nhân
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 mt-1 font-sans VietnameseFont">
              Lịch Sử Đọc Truyện
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl">
              Nơi lưu lại các tác phẩm bạn đã đọc tại Kinkin Michan Truyện. Dữ liệu được mã hóa cục bộ an toàn trên thiết bị của bạn.
            </p>
          </div>

          {historyList.length > 0 && (
            <button
              id="btn-clear-all"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-4 py-2 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-600 hover:border-transparent text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
            >
              <Trash2 className="w-4 h-4" />
              Xóa lịch sử
            </button>
          )}
        </div>

        {/* Content lists */}
        {historyList.length > 0 ? (
          <div id="history-items-list" className="space-y-4">
            {historyList.map((item) => {
              const formattedDate = new Date(item.updatedAt).toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });

              return (
                <div
                  id={`history-row-${item.slug}`}
                  key={item.slug}
                  className="group relative flex flex-col sm:flex-row items-center gap-5 p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900/80 hover:border-purple-500/20 rounded-2xl shadow transition-all duration-300"
                >
                  {/* Comic thumbnail */}
                  <div className="w-24 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 border border-zinc-800 bg-zinc-950">
                    <img
                      src={getMangaCoverUrl(item.thumb_url)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Informative details */}
                  <div className="flex-grow text-center sm:text-left space-y-1.5 min-w-0">
                    <Link
                      id={`title-link-${item.slug}`}
                      to={`/truyen/${item.slug}`}
                      className="text-base sm:text-lg font-black text-zinc-105 hover:text-purple-400 transition-colors line-clamp-1 break-words cursor-pointer"
                    >
                      {item.name}
                    </Link>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-450 font-medium">
                      <span className="flex items-center gap-1.5 text-purple-400 bg-purple-500/5 px-2.5 py-1 rounded-lg border border-purple-500/10">
                        <BookOpen className="w-3.5 h-3.5" />
                        Đang đọc: Chương {item.chapter_name}
                      </span>
                      <span className="text-zinc-550 h-3.5 w-px border-l border-zinc-800 hidden sm:inline" />
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Đọc lúc: {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Operation buttons controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto flex-shrink-0">
                    <Link
                      id={`doc-tiep-link-${item.slug}`}
                      to={`/doc-truyen/${item.slug}/${item.chapter_name}`}
                      state={{ chapterApiUrl: item.chapter_api_data }}
                      className="flex items-center justify-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 shadow active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
                    >
                      Đọc tiếp
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    <button
                      id={`remove-hist-btn-${item.slug}`}
                      onClick={() => handleRemoveItem(item.slug, item.name)}
                      className="p-2 text-zinc-500 hover:text-rose-400 bg-zinc-950/40 hover:bg-rose-500/10 rounded-xl hover:border-rose-500/20 border border-transparent transition-all cursor-pointer"
                      title="Xóa khỏi lịch sử"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Lịch sử đọc trống rỗng"
            description="Bạn chưa lưu lịch sử đọc nào. Hãy tìm kiếm truyện mong muốn và bắt đầu hành trình đọc của mình ngay nhé!"
            actionLabel="Khám phá ngay"
            actionPath="/"
          />
        )}
      </div>
    </div>
  );
}
