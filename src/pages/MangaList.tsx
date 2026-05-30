import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { MangaItem, Pagination } from '../types';
import { fetchMangaList } from '../api/otruyen';
import MangaGrid from '../components/MangaGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

interface MangaListProps {
  typeList: 'truyen-moi' | 'hoan-thanh' | 'dang-phat-hanh' | 'sap-ra-mat';
  title?: string;
}

export default function MangaList({ typeList, title }: MangaListProps) {
  const location = useLocation();
  const [comics, setComics] = useState<MangaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cdnImage, setCdnImage] = useState<string>('');
  const [pageTitle, setPageTitle] = useState(title || 'Danh sách truyện');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMangaList(typeList, currentPage);
      setComics(res.items);
      setPagination(res.pagination);
      setCdnImage(res.cdnImage);
      if (!title) {
        setPageTitle(res.titlePage);
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải dữ liệu truyện.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset page to 1 on list type changes
    setCurrentPage(1);
  }, [typeList]);

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [typeList, currentPage]);

  const handlePageChange = (pageNum: number) => {
    if (!pagination) return;
    if (pageNum < 1 || pageNum > Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)) return;
    setCurrentPage(pageNum);
  };

  const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1;

  // Generate dynamic page pagination range display
  const getPageNumbers = () => {
    if (!pagination) return [];
    const pages: number[] = [];
    const maxLeftRight = 2; // Show 2 pages left/right of active
    
    let start = Math.max(1, currentPage - maxLeftRight);
    let end = Math.min(totalPages, currentPage + maxLeftRight);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div id="manga-list-page" className="min-h-screen bg-zinc-950 pt-3 sm:pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Page title card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Danh mục truyện tranh
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 mt-1 flex items-center gap-1.5 font-sans VietnameseFont">
              {pageTitle}
            </h1>
          </div>
          {pagination && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-850 text-xs font-semibold text-zinc-400">
              <Hash className="w-4 h-4 text-purple-400" />
              Tổng: <span className="text-zinc-200">{pagination.totalItems.toLocaleString()}</span> truyện
            </div>
          )}
        </div>

        {/* Content View */}
        {error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : loading ? (
          <LoadingSkeleton count={12} />
        ) : comics.length > 0 ? (
          <div className="space-y-12">
            <MangaGrid comics={comics} cdnImage={cdnImage} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div id="manga-list-pagination" className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6 border-t border-zinc-900">
                <button
                  id="btn-page-prev"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 sm:px-4 sm:py-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-900 hover:border-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer text-xs sm:text-sm font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                {currentPage > 3 && (
                  <>
                    <button
                      id="btn-page-1"
                      onClick={() => handlePageChange(1)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                        currentPage === 1
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-white'
                      }`}
                    >
                      1
                    </button>
                    {currentPage > 4 && <span className="text-zinc-600 px-1 font-bold text-xs">...</span>}
                  </>
                )}

                {getPageNumbers().map((pageNum) => (
                  <button
                    id={`btn-page-${pageNum}`}
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow shadow-purple-500/20 scale-105'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-900 hover:border-zinc-805 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="text-zinc-600 px-1 font-bold text-xs">...</span>}
                    <button
                      id={`btn-page-${totalPages}`}
                      onClick={() => handlePageChange(totalPages)}
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-bold bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  id="btn-page-next"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 sm:px-4 sm:py-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-905 hover:border-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer text-xs sm:text-sm font-semibold"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500">
            Không tìm thấy truyện nào trong mục này.
          </div>
        )}
      </div>
    </div>
  );
}
