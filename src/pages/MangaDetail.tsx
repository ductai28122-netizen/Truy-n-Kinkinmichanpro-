import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Eye, CheckCircle, Clock, User, Tags, ListCollapse, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { MangaDetail } from '../types';
import { fetchMangaDetail } from '../api/otruyen';
import { getMangaCoverUrl, formatStatus, formatStatusColor, isFavorite, toggleFavorite, getHistory } from '../utils/manga_helpers';
import { useToast } from '../components/Toast';
import ChapterList from '../components/ChapterList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function MangaDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cdnImage, setCdnImage] = useState<string>('');
  const [favorited, setFavorited] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Reading tracking checking state for "Đọc tiếp"
  const [lastReadChapter, setLastReadChapter] = useState<{ chapter_name: string; chapter_api_data: string } | null>(null);

  const loadDetail = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMangaDetail(slug);
      setManga(res.item);
      setCdnImage(res.cdnImage);
      setFavorited(isFavorite(slug));
      
      // Check historical read chapter of this manga
      const hist = getHistory();
      const existing = hist.find((h) => h.slug === slug);
      if (existing) {
        setLastReadChapter({
          chapter_name: existing.chapter_name,
          chapter_api_data: existing.chapter_api_data,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thông tin chi tiết truyện.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleFavoriteToggle = () => {
    if (!manga) return;
    
    const itemToSave = {
      id: manga._id,
      name: manga.name,
      slug: manga.slug,
      thumb_url: manga.thumb_url,
      status: manga.status,
      category: manga.category,
      updatedAt: Date.now(),
    };

    const added = toggleFavorite(itemToSave);
    setFavorited(added);
    
    if (added) {
      showToast('success', `Đã thêm "${manga.name}" vào danh sách Yêu thích!`);
    } else {
      showToast('info', `Đã xóa "${manga.name}" khỏi danh sách Yêu thích.`);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <ErrorState message={error} onRetry={loadDetail} />
      </div>
    );
  }

  if (loading || !manga) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  // Chapter arrays extracting safely
  const server = manga.chapters?.[0]; // Choose primary server
  const chaptersRaw = server && Array.isArray(server.server_data) ? server.server_data : [];

  // Deduplicate chapters by chapter_name to avoid duplicate key issues
  const seenChapters = new Set();
  const chapters = chaptersRaw.filter((c: any) => {
    if (!c.chapter_name) return false;
    if (seenChapters.has(c.chapter_name)) return false;
    seenChapters.add(c.chapter_name);
    return true;
  });
  
  const firstChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null; // In OTruyen lists, chapter index 0 is sometimes chapter 1 or chapter newest. Let's inspect: usually item.chapters[0].server_data starts with Chapter 1 at the END of the array (descending / ascending depending on sync). Let's make sure: usually, first chapter in order is the one with chapter_name = "1" or lower index, let's find the chapter named "1" or take the last element in array as first chapter (very standard in OTruyen since arrays are pushed latest-to-oldest or oldest-to-latest). Better yet, let's sort chapters numerically to find the absolute oldest and newest chapters, so we don't assume! That is 100% bulletproof!
  
  const sortedChaptersAsc = [...chapters].sort((a, b) => {
    const aNum = parseFloat(a.chapter_name) || 0;
    const bNum = parseFloat(b.chapter_name) || 0;
    return aNum - bNum;
  });

  const absoluteFirstChapter = sortedChaptersAsc[0] || null;
  const absoluteLatestChapter = sortedChaptersAsc[sortedChaptersAsc.length - 1] || null;

  return (
    <div id={`detail-page-${manga.slug}`} className="min-h-screen bg-zinc-950 pt-14 sm:pt-16 pb-16 text-zinc-300 animate-fade-in">
      
      {/* Decorative blurred backdrop banner */}
      <div className="relative w-full h-56 sm:h-80 overflow-hidden -mt-14 sm:-mt-16 select-none shadow-md">
        <img
          src={getMangaCoverUrl(manga.thumb_url, cdnImage)}
          alt=""
          className="w-full h-full object-cover blur-3xl opacity-20 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-52 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Back navigation button */}
        <button
          id="btn-back-to-last"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-900/90 hover:border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold w-fit cursor-pointer transition-all shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </button>

        {/* Top summary details container (Split 2 cols on PC, Single column on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Cover view */}
          <div className="mx-auto md:mx-0 w-48 sm:w-56 md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-zinc-850 bg-zinc-900 relative">
            <img
              src={getMangaCoverUrl(manga.thumb_url, cdnImage)}
              alt={manga.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=350&auto=format&fit=crop';
              }}
            />
          </div>

          {/* Right Column: Informative blocks */}
          <div className="md:col-span-2 space-y-5 text-center md:text-left py-2">
            
            {/* Badges container */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border bg-zinc-900/50 backdrop-blur-md ${formatStatusColor(manga.status)}`}>
                {formatStatus(manga.status)}
              </span>
              
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-900/60 border border-zinc-900 text-zinc-400">
                {chapters.length} Chương
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3.5xl font-black text-zinc-50 leading-tight tracking-tight font-sans VietnameseFont">
              {manga.name}
            </h1>

            {/* Origin title names */}
            {manga.origin_name && Array.isArray(manga.origin_name) && manga.origin_name.length > 0 && manga.origin_name[0] !== manga.name && (
              <p className="text-zinc-500 text-sm italic font-medium -mt-1.5">
                Tên khác: {manga.origin_name.join(', ')}
              </p>
            )}

            {/* Authors & Category tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-t border-b border-zinc-900 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-855 flex items-center justify-center text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-550 font-extrabold leading-none">Tác giả</div>
                  <div className="text-zinc-350 font-bold mt-0.5">
                    {manga.author && Array.isArray(manga.author) && manga.author.length > 0 ? manga.author.join(', ') : 'Đang cập nhật'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-855 flex items-center justify-center text-purple-400">
                  <Tags className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-550 font-extrabold leading-none">Phân phối</div>
                  <div className="text-zinc-350 font-bold mt-0.5">Kinkin Michan</div>
                </div>
              </div>
            </div>

            {/* Action buttons controls panel */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-3 pt-2">
              {/* Read from begin */}
              {absoluteFirstChapter ? (
                <Link
                  id="btn-read-first"
                  to={`/doc-truyen/${manga.slug}/${absoluteFirstChapter.chapter_name}?api=${encodeURIComponent(absoluteFirstChapter.chapter_api_data)}`}
                  state={{ chapterApiUrl: absoluteFirstChapter.chapter_api_data }}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:brightness-110 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-98 transition-all w-full sm:w-auto cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  Đọc Từ Đầu
                </Link>
              ) : null}

              {/* Read latest */}
              {absoluteLatestChapter ? (
                <Link
                  id="btn-read-latest"
                  to={`/doc-truyen/${manga.slug}/${absoluteLatestChapter.chapter_name}?api=${encodeURIComponent(absoluteLatestChapter.chapter_api_data)}`}
                  state={{ chapterApiUrl: absoluteLatestChapter.chapter_api_data }}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-zinc-350 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 hover:border-zinc-70s transition-all w-full sm:w-auto cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4 text-purple-400" />
                  Chương Mới Nhất
                </Link>
              ) : null}

              {/* Read tracker option (Đọc Tiếp) */}
              {lastReadChapter && (
                <Link
                  id="btn-continue-read"
                  to={`/doc-truyen/${manga.slug}/${lastReadChapter.chapter_name}?api=${encodeURIComponent(lastReadChapter.chapter_api_data)}`}
                  state={{ chapterApiUrl: lastReadChapter.chapter_api_data }}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all w-full sm:w-auto cursor-pointer"
                >
                  Đọc Tiếp (Ch. {lastReadChapter.chapter_name})
                </Link>
              )}

              {/* Add/remove Favorite toggle */}
              <button
                id="btn-favorite-toggle"
                onClick={handleFavoriteToggle}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all w-full sm:w-auto cursor-pointer ${
                  favorited
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                    : 'bg-zinc-900 border-zinc-805 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform ${favorited ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                {favorited ? 'Đã Yêu Thích' : 'Yêu Thích'}
              </button>
            </div>

            {/* Category Tags */}
            {manga.category && Array.isArray(manga.category) && manga.category.length > 0 && (
              <div className="space-y-1.5 pt-3">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Danh mục chủ đề</div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                  {manga.category.map((cat) => (
                    <Link
                      id={`detail-cat-tag-${cat.slug}`}
                      key={cat.slug}
                      to={`/the-loai/${cat.slug}`}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Synopsis detail segment */}
        <section id="synopsis-section" className="bg-zinc-900/10 p-4 sm:p-6 rounded-2xl border border-zinc-800/40 backdrop-blur-sm space-y-2.5">
          <h2 className="text-sm sm:text-base font-black text-zinc-100 flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-500 rounded" />
            Tóm tắt truyện
          </h2>
          <div className="relative">
            <p 
              id="manga-content-paragraph"
              className={`text-xs sm:text-sm text-zinc-405 leading-relaxed text-justify whitespace-pre-line ${
                !expanded ? 'line-clamp-4 md:line-clamp-none' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: manga.content || 'Nội dung cốt truyện đang được ban quản trị website Kinkin Michan cập nhật trong thời gian sớm nhất.' }}
            />
            
            {manga.content && manga.content.length > 250 && (
              <button
                id="btn-toggle-expand"
                onClick={() => setExpanded(!expanded)}
                className="text-[11px] font-extrabold text-purple-400 hover:text-purple-300 mt-2 block cursor-pointer transition-colors align-middle focus:outline-none"
              >
                {expanded ? 'Thu gọn' : 'Xem thêm...'}
              </button>
            )}
          </div>
        </section>

        {/* Chapters list layout block */}
        <section id="chapters-list-card" className="bg-zinc-900/20 p-5 sm:p-6 rounded-2xl border border-zinc-900/50">
          <ChapterList 
            chapters={chapters} 
            mangaSlug={manga.slug} 
            currentChapterName={lastReadChapter?.chapter_name} 
          />
        </section>

      </div>
    </div>
  );
}
