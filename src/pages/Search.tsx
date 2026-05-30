import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Compass, Sparkles } from 'lucide-react';
import { MangaItem, Pagination } from '../types';
import { searchManga } from '../api/otruyen';
import MangaGrid from '../components/MangaGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  
  const [comics, setComics] = useState<MangaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cdnImage, setCdnImage] = useState<string>('');
  
  const [debouncedKeyword, setDebouncedKeyword] = useState(keywordParam);

  // Debounce logic for raw input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keywordParam);
    }, 450); // 450ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [keywordParam]);

  const loadResults = async () => {
    if (!debouncedKeyword.trim()) {
      setComics([]);
      setPagination(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const res = await searchManga(debouncedKeyword, 1);
      setComics(res.items);
      setPagination(res.pagination);
      setCdnImage(res.cdnImage);
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi thực hiện tìm kiếm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [debouncedKeyword]);

  const handleInlineSearch = (val: string) => {
    setSearchParams(val ? { keyword: val } : {});
  };

  return (
    <div id="search-page" className="min-h-screen bg-zinc-950 pt-3 sm:pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header segment of Search */}
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Hệ thống tra cứu dữ liệu
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 mt-1 font-sans VietnameseFont flex items-center gap-2">
            Tìm Kiếm Truyện Tranh
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Nhập từ khóa (tên truyện tiếng Việt, tên gốc hoặc tên tác giả, thể loại) để tìm tác phẩm mong muốn.
          </p>
        </div>

        {/* Dynamic Mobile Search slot */}
        <div className="max-w-xl">
          <SearchBar 
            placeholder="Gõ tên truyện hoặc từ khóa tìm kiếm..." 
            onSearchChange={handleInlineSearch} 
            isSearching={loading} 
          />
        </div>

        {/* Results layout */}
        <div className="pt-2">
          {error ? (
            <ErrorState message={error} onRetry={loadResults} />
          ) : loading ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-zinc-500 animate-pulse flex items-center gap-2">
                Đang đối chiếu dữ liệu truyện...
              </p>
              <LoadingSkeleton count={12} />
            </div>
          ) : comics.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold bg-zinc-900/40 px-4 py-2 rounded-xl border border-zinc-900 w-fit">
                <SearchIcon className="w-4 h-4 text-purple-400" />
                Đã tìm được <span className="text-zinc-200">{comics.length}</span> tác phẩm tương thích cho từ khóa "{debouncedKeyword}"
              </div>
              <MangaGrid comics={comics} cdnImage={cdnImage} />
            </div>
          ) : debouncedKeyword.trim() ? (
            <EmptyState
              title={`Không tìm thấy kết quả cho "${debouncedKeyword}"`}
              description="Hãy thử nhập bằng từ khóa ngắn gọn hơn hoặc kiểm tra xem có sai sót chính tả nào không nhé."
              actionLabel="Xem truyện mới"
              actionPath="/truyen-moi"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-zinc-900/10 rounded-2xl border border-zinc-900 max-w-lg mx-auto my-8">
              <div className="w-14 h-14 rounded-full bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-zinc-600 mb-4">
                <SearchIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-400">Đang chờ bạn gõ tìm kiếm...</h3>
              <p className="text-xs text-zinc-500 mt-1">Các tác phẩm mới được đồng bộ theo thời gian thực từ máy chủ.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
