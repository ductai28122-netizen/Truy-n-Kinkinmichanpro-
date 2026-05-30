import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, ArrowUp, RefreshCw, Layers, Sliders } from 'lucide-react';
import { ChapterDetail, MangaDetail } from '../types';
import { fetchChapterDetail, fetchMangaDetail } from '../api/otruyen';
import { saveHistory } from '../utils/manga_helpers';
import { useToast } from '../components/Toast';
import ErrorState from '../components/ErrorState';

export default function Reader() {
  const { slug, chapter } = useParams<{ slug: string; chapter: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [chapterDetail, setChapterDetail] = useState<ChapterDetail | null>(null);
  const [parentManga, setParentManga] = useState<MangaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Back to top display state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load all detail sources: first load active chapter, then load parent manga for sibling chapters links
  const loadChapterContent = async () => {
    if (!slug || !chapter) return;
    try {
      setLoading(true);
      setError(null);

      // Determine the API URL for this chapter
      let resolvedApiUrl = (location.state as any)?.chapterApiUrl;
      if (!resolvedApiUrl) {
        // Construct canonical fallback chapter url if accessed directly
        resolvedApiUrl = `https://sv1.otruyencdn.com/v1/api/chapter/${slug}/${chapter}`;
      }

      // 1. Fetch Chapter image metadata
      const chDetail = await fetchChapterDetail(resolvedApiUrl);
      setChapterDetail(chDetail);

      // 2. Fetch Parent manga details for dropdown options & navigation list
      let parentRes = null;
      try {
        const detailRes = await fetchMangaDetail(slug);
        parentRes = detailRes.item;
        setParentManga(detailRes.item);
      } catch (err) {
        console.error('Failed fetching parent list details', err);
      }

      // 3. Save to localStorage reading history securely
      if (chDetail) {
        saveHistory({
          id: chDetail._id || slug,
          name: chDetail.comic_name || parentRes?.name || slug,
          slug,
          thumb_url: parentRes?.thumb_url || '',
          chapter_name: chapter,
          chapter_title: chDetail.chapter_title || `Chương ${chapter}`,
          chapter_api_data: resolvedApiUrl,
          updatedAt: Date.now(),
        });
      }

    } catch (err: any) {
      setError(err?.message || 'Không thể tải nội dung chương truyện. Hãy thử chọn chương khác hoặc tải lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapterContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, chapter]);

  // Display back-to-top handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <ErrorState message={error} onRetry={loadChapterContent} />
      </div>
    );
  }

  // Get sibling chapters list
  const chaptersListRaw = parentManga?.chapters?.[0]?.server_data || [];
  
  // Deduplicate chapters by chapter_name
  const seenChapters = new Set();
  const chaptersList = chaptersListRaw.filter((c: any) => {
    if (!c.chapter_name) return false;
    if (seenChapters.has(c.chapter_name)) return false;
    seenChapters.add(c.chapter_name);
    return true;
  });
  
  // Sort numerically for correct stepping
  const sortedChapters = [...chaptersList].sort((a, b) => {
    const aNum = parseFloat(a.chapter_name) || 0;
    const bNum = parseFloat(b.chapter_name) || 0;
    return aNum - bNum;
  });

  const currentIndex = sortedChapters.findIndex(c => c.chapter_name === chapter);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  const handleChapterSelect = (selectedName: string) => {
    const found = sortedChapters.find(c => c.chapter_name === selectedName);
    if (found) {
      navigate(`/doc-truyen/${slug}/${found.chapter_name}`, {
        state: { chapterApiUrl: found.chapter_api_data }
      });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper page image builder
  const buildPageImageUrl = (imgFile: string) => {
    if (!chapterDetail) return '';
    const serverImage = chapterDetail.server_image.endsWith('/') 
      ? chapterDetail.server_image.slice(0, -1) 
      : chapterDetail.server_image;
    const chapterPath = chapterDetail.chapter_path.startsWith('/') 
      ? chapterDetail.chapter_path.slice(1) 
      : chapterDetail.chapter_path;
    return `${serverImage}/${chapterPath}/${imgFile}`;
  };

  return (
    <div id={`reader-view-${chapter}`} className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      
      {/* Upper Navigation sticky ribbon bar */}
      <div className="fixed top-0 left-0 right-0 h-12 sm:h-14 bg-zinc-950/95 border-b border-zinc-900 z-45 backdrop-blur-md flex items-center shadow-lg px-2 sm:px-4 gap-2 sm:gap-4">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between text-xs sm:text-sm font-semibold">
          
          {/* Back to details link */}
          <Link
            id="reader-back-link"
            to={`/truyen/${slug}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl hover:text-purple-400 text-zinc-300 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            <span className="hidden sm:inline">Chi tiết truyện</span>
          </Link>

          {/* Quick chapter selection control dropdown */}
          <div className="flex items-center gap-1 sm:gap-2">
            {sortedChapters.length > 0 ? (
              <div className="relative">
                <select
                  id="dropdown-chapter-select"
                  value={chapter}
                  onChange={(e) => handleChapterSelect(e.target.value)}
                  className="appearance-none bg-zinc-900 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2 pr-7 sm:pr-8 font-extrabold focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs sm:text-sm cursor-pointer shadow-inner"
                >
                  {sortedChapters.map((c) => (
                    <option key={c.chapter_name} value={c.chapter_name}>
                      Chương {c.chapter_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 sm:px-2.5 text-purple-400">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-zinc-900/60 text-zinc-500 text-xs text-center border border-zinc-900">
                Chương {chapter}
              </div>
            )}
          </div>

          {/* Previous/Next buttons block */}
          <div className="flex items-center gap-1.5">
            <button
              id="reader-prev-btn"
              disabled={!prevChapter}
              onClick={() => handleChapterSelect(prevChapter!.chapter_name)}
              className="p-1.5 sm:p-2 bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl cursor-pointer transition-all"
              title="Chương trước"
            >
              <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            <button
              id="reader-next-btn"
              disabled={!nextChapter}
              onClick={() => handleChapterSelect(nextChapter!.chapter_name)}
              className="p-1.5 sm:p-2 bg-zinc-900 border border-zinc-900 hover:border-zinc-805 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl cursor-pointer transition-all"
              title="Chương sau"
            >
              <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Core Reading pages layout */}
      <main className="flex-grow pt-14 sm:pt-20 pb-20 px-0 max-w-2xl sm:max-w-3xl mx-auto w-full space-y-0.5 bg-zinc-950">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-36 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-purple-400 animate-spin" />
            <p className="text-zinc-400 text-sm font-bold">Đang tải và chuẩn bị trang truyện...</p>
            <p className="text-zinc-650 text-xs italic">Vui lòng đợi trong giây lát</p>
          </div>
        ) : chapterDetail && chapterDetail.chapter_images.length > 0 ? (
          <div id="manga-pages-list" className="flex flex-col items-center select-none">
            {chapterDetail.chapter_images.map((img, i) => (
              <div 
                key={img.image_file || i} 
                className="relative w-full bg-zinc-950 overflow-hidden flex items-center justify-center"
              >
                <img
                  src={buildPageImageUrl(img.image_file)}
                  alt={`Trang ${img.image_page}`}
                  loading="lazy"
                  className="w-full h-auto object-contain select-none max-w-full"
                  onError={(e) => {
                    // fallbacks
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x900/18181b/52525b?text=Err+Loading+Page';
                  }}
                />
                
                {/* Floating Page numbering tracker */}
                <div className="absolute bottom-2 right-4 bg-black/60 backdrop-blur text-[10px] text-zinc-400 font-bold px-2 py-0.5 rounded shadow z-10 select-none pointer-events-none">
                  Trang {img.image_page}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-zinc-500">
            Không thể tải ảnh của chương truyện này. Có thể chương đang bảo trì.
          </div>
        )}

        {/* Lower Chapter Navigation Control bars */}
        {!loading && chapterDetail && (
          <div className="pt-10 px-4 md:px-0 flex flex-col sm:flex-row items-center justify-between gap-5 border-t border-zinc-900 mt-8">
            <div className="text-center sm:text-left space-y-1">
              <h4 className="text-zinc-300 font-black text-sm">Bạn đã đọc xong Chương {chapter}</h4>
              <p className="text-zinc-550 text-xs">{chapterDetail.comic_name}</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {prevChapter ? (
                <button
                  id="lower-prev-btn"
                  onClick={() => handleChapterSelect(prevChapter.chapter_name)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white rounded-xl text-xs font-bold border border-zinc-90 w-fit cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Chương trước
                </button>
              ) : null}

              {nextChapter ? (
                <button
                  id="lower-next-btn"
                  onClick={() => handleChapterSelect(nextChapter.chapter_name)}
                  className="flex-grow sm:flex-none flex items-center justify-center gap-1 px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:brightness-110 text-white rounded-xl text-xs font-extrabold shadow shadow-purple-500/10 cursor-pointer transition-all animate-pulse"
                >
                  Chương sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  id="lower-finish-link"
                  to={`/truyen/${slug}`}
                  className="flex-grow sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-purple-400 rounded-xl text-xs font-bold transition-all"
                >
                  <Layers className="w-4 h-4" />
                  Về Trang Truyện
                </Link>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button: Scroll back to top */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={handleScrollToTop}
          className="fixed bottom-5 right-5 z-45 p-2.5 sm:p-3.5 bg-purple-600/70 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-600/20 hover:-translate-y-1 active:scale-95 transition-all cursor-pointer border border-purple-500/10 backdrop-blur-sm"
          title="Về đầu trang"
        >
          <ArrowUp className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
        </button>
      )}

    </div>
  );
}
