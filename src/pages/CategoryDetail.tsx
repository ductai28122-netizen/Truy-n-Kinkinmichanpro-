import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Compass, Hash } from 'lucide-react';
import { MangaItem, Category, Pagination } from '../types';
import { fetchMangaByCategory, fetchCategories } from '../api/otruyen';
import MangaGrid from '../components/MangaGrid';
import CategoryList from '../components/CategoryList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [comics, setComics] = useState<MangaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cdnImage, setCdnImage] = useState<string>('');
  const [genreTitle, setGenreTitle] = useState('Thể loại');

  // Load sibling genres list for quick selecting
  useEffect(() => {
    const loadRegCategories = async () => {
      try {
        setCategoriesLoading(true);
        const list = await fetchCategories();
        setCategories(list);
      } catch (err) {
        console.error('Failed loading categories', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadRegCategories();
  }, []);

  const loadData = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMangaByCategory(slug, currentPage);
      setComics(res.items);
      setPagination(res.pagination);
      setCdnImage(res.cdnImage);
      setGenreTitle(res.titlePage);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải truyện của thể loại này.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, currentPage]);

  const handlePageChange = (pageNum: number) => {
    if (!pagination) return;
    if (pageNum < 1 || pageNum > Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)) return;
    setCurrentPage(pageNum);
  };

  const handleCategorySwitch = (newSlug: string) => {
    navigate(`/the-loai/${newSlug}`);
  };

  const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1;

  const getPageNumbers = () => {
    if (!pagination) return [];
    const pages: number[] = [];
    const maxLeftRight = 2;
    let start = Math.max(1, currentPage - maxLeftRight);
    let end = Math.min(totalPages, currentPage + maxLeftRight);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Find active category item name
  const currentCategory = categories.find(c => c.slug === slug);
  const displayTitle = currentCategory?.name ? `Thể Loại: ${currentCategory.name}` : genreTitle;

  return (
    <div id="category-detail-page" className="min-h-screen bg-zinc-950 pt-3 sm:pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Genre fast tag selector header */}
        {!categoriesLoading && categories.length > 0 && (
          <div className="bg-zinc-900/20 p-3 sm:p-4 rounded-2xl border border-zinc-900 space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Chuyển nhanh thể loại khác
            </div>
            <CategoryList 
              categories={categories} 
              activeSlug={slug} 
              onCategoryClick={handleCategorySwitch} 
              layout="scroll" 
            />
          </div>
        )}

        {/* List header title card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Bộ lọc thể loại
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 mt-1 font-sans VietnameseFont">
              {displayTitle}
            </h1>
          </div>
          {pagination && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-850 text-xs font-semibold text-zinc-400">
              <Hash className="w-4 h-4 text-purple-400" />
              Tìm thấy <span className="text-zinc-200">{pagination.totalItems.toLocaleString()}</span> truyện
            </div>
          )}
        </div>

        {/* Content lists layout */}
        {error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : loading ? (
          <LoadingSkeleton count={12} />
        ) : comics.length > 0 ? (
          <div className="space-y-12">
            <MangaGrid comics={comics} cdnImage={cdnImage} />

            {/* Pagination block */}
            {totalPages > 1 && (
              <div id="category-pagination" className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6 border-t border-zinc-900">
                <button
                  id="btn-cat-prev"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 sm:px-4 sm:py-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-900 hover:border-zinc-805 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer text-xs sm:text-sm font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                {currentPage > 3 && (
                  <>
                    <button
                      id="btn-cat-p1"
                      onClick={() => handlePageChange(1)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                        currentPage === 1
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-white'
                      }`}
                    >
                      1
                    </button>
                    {currentPage > 4 && <span className="text-zinc-600 px-1 font-semibold text-xs">...</span>}
                  </>
                )}

                {getPageNumbers().map((pageNum) => (
                  <button
                    id={`btn-cat-p${pageNum}`}
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow shadow-purple-500/20 scale-105'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="text-zinc-600 px-1 font-semibold text-xs">...</span>}
                    <button
                      id={`btn-cat-plast`}
                      onClick={() => handlePageChange(totalPages)}
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-bold bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  id="btn-cat-next"
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
          <div className="py-24 text-center text-zinc-500">
            Không tìm thấy truyện nào thuộc thể loại này.
          </div>
        )}
      </div>
    </div>
  );
}
